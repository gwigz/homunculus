import { Chunk, Data, Deferred, Effect, Queue, Ref, Schedule } from "effect"
import * as Packets from "~/codec/generated/packets"
import type { Simulator } from "~/layers/registry-layer"
import * as Decoder from "./packet-decoder"

const MAX_SEQUENCE = 0x01000000

export interface Circuit {
	/**
	 * Sends a packet and returns an `Effect` that will succeed once the packet has
	 * been sent.
	 */
	send: <Data>(
		encode: (sequence: number, reliable: boolean, data: Data) => Buffer,
		data: Data,
		reliable?: boolean,
	) => Effect.Effect<void, PacketSendFailureError>

	/**
	 * Sends a packet reliably and returns an `Effect` that will succeed once the
	 * packet has been acknowledged by the remote simulator. The packet will be
	 * retried every 1 second up to **three** additional attempts before the
	 * returned `Effect` fails with a timeout error.
	 */
	sendReliable: <Data>(
		encode: (sequence: number, reliable: boolean, data: Data) => Buffer,
		data: Data,
	) => Effect.Effect<void, PacketAckTimeoutError | PacketSendFailureError>
}

export class PacketSendFailureError extends Data.TaggedError(
	"PacketSendFailureError",
)<{
	readonly message: string
	readonly cause: unknown
}> {}

export class PacketAckTimeoutError extends Data.TaggedError(
	"PacketAckTimeoutError",
)<{
	readonly message: string
}> {}

interface PendingAck {
	buffer: Buffer
	retries: number
	timestamp: number
	deferred: Deferred.Deferred<
		void,
		PacketAckTimeoutError | PacketSendFailureError
	>
}

/** @internal */
export function make(simulator: Omit<Simulator, "id" | "ready" | "circuit">) {
	return Effect.gen(function* () {
		const sequence = yield* Ref.make<number>(1)

		// our own packets that we're waiting for an ack for
		const unacked = new Map<number, PendingAck>()

		// incoming packets that we're due to acknowledge, once the next ack flush is sent
		const pendingAcks = yield* Queue.unbounded<number>()

		// reader fiber
		yield* Effect.repeat(
			Effect.gen(function* () {
				const buffer = yield* Queue.take(simulator.inbound)
				const header = Decoder.decodeHeader(buffer)

				const isPacketAck =
					header.id === Packets.PacketAck.id &&
					header.frequency === Packets.PacketAck.frequency

				const isPingCheck =
					header.id === Packets.StartPingCheck.id &&
					header.frequency === Packets.StartPingCheck.frequency

				const acks = isPacketAck
					? Packets.PacketAck.decode(buffer).packets.map((packet) => packet.id)
					: header.ack
						? Decoder.decodeAppendedAcks(buffer)
						: []

				for (const ack of acks) {
					const entry = unacked.get(ack)

					if (entry) {
						yield* Deferred.succeed(entry.deferred, undefined)

						unacked.delete(ack)
					}
				}

				if (isPingCheck) {
					const pingCheck = Packets.StartPingCheck.decode(buffer)

					yield* send(Packets.CompletePingCheck.encode, {
						pingId: { pingId: pingCheck.pingId.pingId },
					})
				}

				if (header.reliable) {
					yield* Queue.offer(pendingAcks, header.sequence)
				}

				if (!isPacketAck && !isPingCheck) {
					// TODO: pass this onto event loop
				}
			}),
			Schedule.forever,
		).pipe(Effect.forkIn(simulator.scope))

		// reader -> acknowledger flusher fiber
		yield* Effect.repeat(
			Effect.gen(function* () {
				// NOTE: we can only send 255 packets per message
				const chunk = yield* Queue.takeBetween(pendingAcks, 1, 255)
				const packets = Chunk.toArray(chunk).map((id) => ({ id }))

				yield* send(Packets.PacketAck.encode, { packets })
			}),
			Schedule.addDelay(Schedule.forever, () => "100 millis"),
		).pipe(Effect.forkIn(simulator.scope))

		const getNextSequence = () =>
			Ref.modify(sequence, (seq) => [seq, (seq + 1) % MAX_SEQUENCE])

		const safeEncode = <Data>(
			seq: number,
			encode: (seq: number, reliable: boolean, data: Data) => Buffer,
			data: Data,
			reliable = false,
		) =>
			Effect.try({
				try: () => encode(seq, reliable, data),
				catch: (error) =>
					new PacketSendFailureError({
						message: "Failed to encode packet",
						cause: error,
					}),
			})

		const send = <Data>(
			encode: (seq: number, reliable: boolean, data: Data) => Buffer,
			data: Data,
			reliable = false,
		) =>
			getNextSequence().pipe(
				Effect.flatMap((seq) => safeEncode(seq, encode, data, reliable)),
				Effect.flatMap((buffer) => sendRaw(buffer)),
			)

		const sendReliable = <Data>(
			encode: (seq: number, reliable: boolean, data: Data) => Buffer,
			data: Data,
		) =>
			Effect.gen(function* () {
				const seq = yield* getNextSequence()
				const buffer = yield* safeEncode(seq, encode, data, true)

				const deferred = yield* Deferred.make<
					void,
					PacketAckTimeoutError | PacketSendFailureError
				>()

				// register in the map so the reader fibre can complete the ackGate
				unacked.set(seq, {
					buffer,
					retries: 0,
					timestamp: Date.now(),
					deferred,
				})

				// TODO: add timeout error, lol
				// TODO: flag as resent if we've already sent it
				// yield* Effect.repeat(sendRaw(buffer), {
				// 	until: () => Deferred.isDone(deferred),
				// 	schedule: Schedule.addDelay(Schedule.recurs(2), () => "2 seconds"),
				// })

				yield* sendRaw(buffer)

				return yield* Deferred.await(deferred)
			})

		const sendRaw = (buffer: Buffer) =>
			Effect.tryPromise({
				try: () =>
					new Promise<void>((resolve, reject) =>
						// TODO: can append acks to the buffer if we want to
						simulator.socket.send(buffer, (error) =>
							error ? reject(error) : resolve(),
						),
					),
				catch: (error) =>
					new PacketSendFailureError({
						message: "Failed to send packet",
						cause: error,
					}),
			})

		return { send, sendReliable } satisfies Circuit
	})
}

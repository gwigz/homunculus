import dgram from "node:dgram"
import { Context, Data, Effect, Layer, Option, Queue, Ref, Scope } from "effect"
import * as Packets from "~/codec/generated/packets"
import * as Circuit from "~/layers/circuit-layer"
import type { UUID } from "~/model/types"

export type SimulatorId = `${string}:${number}` & { readonly _: unique symbol }

export interface SimulatorInfo {
	simIp: string
	simPort: number
	circuitCode: number // TODO: redacted?
	agentId: UUID
	sessionId: UUID // TODO: redacted?
}

export interface Simulator {
	readonly id: SimulatorId
	readonly ready: Effect.Latch
	readonly scope: Scope.CloseableScope
	readonly circuit: Circuit.Circuit

	/** @internal */
	readonly socket: dgram.Socket

	/** @internal */
	readonly inbound: Queue.Queue<Buffer>
}

export class SimulatorHandshakeError extends Data.TaggedError(
	"SimulatorHandshakeError",
)<{
	readonly id: SimulatorId
	readonly message: string
	readonly cause?: Error
}> {}

export interface RegistryService {
	// TODO: can't we have multiple circuits per simulator? may need to refactor
	// this just a little bit...
	readonly discovered: Ref.Ref<Map<SimulatorId, SimulatorInfo>>
	readonly live: Ref.Ref<Map<SimulatorId, Simulator>>
	readonly current: Ref.Ref<Option.Option<SimulatorId>>

	/**
	 * Connects to a simulator and returns a `Simulator` instance.
	 *
	 * This also initiates UDP related fibers, such as handling incoming/outgoing
	 * packets. Including packet acknowledgements, ping checks, etc.
	 */
	connect(
		info: SimulatorInfo,
	): Effect.Effect<Simulator, SimulatorHandshakeError>

	/**
	 * Promotes a simulator to the current circuit.
	 *
	 * This does fire off the `CompleteAgentMovement` packet, which is required
	 * to "move" the agent into the region. Along with the `RegionHandshakeReply`
	 * packet, which is required to complete the login sequence.
	 *
	 * @todo Should be able to connect to regions without "moving" into them
	 */
	promote(
		info: SimulatorInfo,
	): Effect.Effect<Simulator, SimulatorHandshakeError>

	/**
	 * Gets a simulator by it's IP and port.
	 */
	get(id: SimulatorId): Effect.Effect<Simulator | undefined>
}

export class Registry extends Context.Tag("homunculus/Registry")<
	Registry,
	RegistryService
>() {}

export const RegistryLive = Layer.effect(
	Registry,
	Effect.gen(function* () {
		// TODO: for this and live, maybe consider state functions like the counter example
		// https://effect.website/docs/state-management/ref/#using-ref
		const discovered = yield* Ref.make<Map<SimulatorId, SimulatorInfo>>(
			new Map(),
		)

		const live = yield* Ref.make<Map<SimulatorId, Simulator>>(new Map())

		// TODO: maybe use SubscriptionRef here?
		const current = yield* Ref.make<Option.Option<SimulatorId>>(Option.none())

		const toId = (info: SimulatorInfo) =>
			`${info.simIp}:${info.simPort}` as SimulatorId

		const connect = (info: SimulatorInfo) =>
			Effect.gen(function* () {
				const id = toId(info)

				// track discovery
				yield* Ref.update(discovered, (map) => map.set(id, info))

				// return existing connection if present
				const maybeExisting = yield* get(id)

				if (maybeExisting) {
					return maybeExisting
				}

				// worth adding a latch here? we don't want to connect to the same
				// simulator twice, plus fibers may want to wait for the connection to
				// be established

				// otherwise spin-up a new connection
				const socket = dgram.createSocket("udp4")
				const inbound = yield* Queue.unbounded<Buffer>()

				socket.on("message", (buffer) => Effect.runSync(inbound.offer(buffer)))

				yield* Effect.promise(
					() =>
						new Promise((resolve, reject) => {
							let error: Error | undefined

							function onError(err: Error) {
								error = err
							}

							socket.once("error", onError)

							socket.connect(info.simPort, info.simIp, () => {
								if (error) {
									reject(
										new SimulatorHandshakeError({
											id,
											message: "Failed to open socket",
											cause: error,
										}),
									)
								} else {
									socket.removeListener("error", onError)

									resolve(socket)
								}
							})
						}),
				)

				const ready = yield* Effect.makeLatch()
				const scope = yield* Scope.make()

				const circuit = yield* Circuit.make({
					socket,
					inbound,
					scope,
				})

				const simulator: Simulator = {
					id,
					socket,
					inbound,
					ready,
					scope,
					circuit,
				}

				// TODO: improve this
				socket.on("error", (error) => {
					console.error("socket error", error)
				})

				yield* Ref.update(live, (map) => map.set(id, simulator))

				yield* simulator.circuit
					.sendReliable(Packets.UseCircuitCode.encode, {
						circuitCode: {
							id: info.agentId,
							code: info.circuitCode,
							sessionId: info.sessionId,
						},
					})
					.pipe(
						Effect.catchAll((error) =>
							Effect.fail(
								new SimulatorHandshakeError({
									id,
									message: "Failed to send UseCircuitCode packet",
									cause: error,
								}),
							),
						),
					)

				// TODO: do this once region handshake reply is sent
				yield* simulator.ready.open

				return simulator
			})

		const promote = (info: SimulatorInfo) =>
			Effect.gen(function* () {
				const id = toId(info)
				const simulator = yield* get(id)

				if (!simulator) {
					return yield* Effect.fail(
						new SimulatorHandshakeError({ id, message: "Not connected" }),
					)
				}

				yield* simulator.circuit
					.sendReliable(Packets.CompleteAgentMovement.encode, {
						// TODO: make this optional again
						agentData: {
							agentId: info.agentId,
							sessionId: info.sessionId,
							circuitCode: info.circuitCode,
						},
					})
					.pipe(
						Effect.catchAll((error) =>
							Effect.fail(
								new SimulatorHandshakeError({
									id,
									message: "Failed to send CompleteAgentMovement packet",
									cause: error,
								}),
							),
						),
					)

				// remaining login sequence steps (wait for RegionHandshake, respond with RegionHandshakeReply)
				// https://wiki.secondlife.com/wiki/Login_sequence
				yield* Ref.set(current, Option.some(id))

				return simulator
			})

		const get = (id: SimulatorId) =>
			Ref.get(live).pipe(Effect.map((sims) => sims.get(id)))

		return {
			discovered,
			live,
			current,
			connect,
			promote,
			get,
		} satisfies RegistryService
	}),
)

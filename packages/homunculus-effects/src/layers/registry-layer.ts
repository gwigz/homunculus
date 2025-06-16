import dgram from "node:dgram"
import { Context, Data, Effect, Layer, Option, Queue, Ref } from "effect"

export type SimulatorId = `${string}:${number}` & { readonly _: unique symbol }

export interface SimulatorInfo {
	simIp: string
	simPort: number
	circuitCode: number // redacted?
}

export interface Simulator {
	readonly id: SimulatorId
	readonly socket: dgram.Socket
	readonly packets: Queue.Queue<Buffer>
	readonly ready: Effect.Latch
}

export class SimulatorHandshakeError extends Data.TaggedError(
	"SimulatorHandshakeError",
)<{
	readonly id: SimulatorId
	readonly message: string
	readonly cause?: Error
}> {}

export interface RegistryService {
	readonly discovered: Ref.Ref<Map<SimulatorId, SimulatorInfo>>
	readonly live: Ref.Ref<Map<SimulatorId, Simulator>>
	readonly current: Ref.Ref<Option.Option<SimulatorId>>

	connect(info: SimulatorInfo): Effect.Effect<Simulator>
	promote(id: SimulatorId): Effect.Effect<void, SimulatorHandshakeError>
	get(id: SimulatorId): Effect.Effect<Simulator | undefined>
}

export class Registry extends Context.Tag("homunculus/Registry")<
	Registry,
	RegistryService
>() {}

export const RegistryLive = Layer.effect(
	Registry,
	Effect.gen(function* () {
		const discovered = yield* Ref.make<Map<SimulatorId, SimulatorInfo>>(
			new Map(),
		)

		const live = yield* Ref.make<Map<SimulatorId, Simulator>>(new Map())
		const current = yield* Ref.make<Option.Option<SimulatorId>>(Option.none())

		const toId = (info: SimulatorInfo) =>
			`${info.simIp}:${info.simPort}` as SimulatorId

		const connect = (info: SimulatorInfo) =>
			Effect.gen(function* () {
				const id = toId(info)

				// track discovery
				yield* Ref.update(discovered, (map) => {
					const next = new Map(map)

					// track the new discovery
					next.set(id, info)

					return next
				})

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

				const packets = yield* Queue.unbounded<Buffer>()
				const ready = yield* Effect.makeLatch()

				const simulator: Simulator = { id, socket, packets, ready }

				socket.on("message", (buffer) => {
					packets.offer(buffer)
				})

				// socket.on("error", (error) => {})

				yield* Ref.update(live, (map) => {
					const next = new Map(map)

					// record the new connection
					next.set(id, simulator)

					return next
				})

				return simulator
			})

		const promote = (id: SimulatorId) =>
			Effect.gen(function* () {
				const exists = yield* Ref.get(live).pipe(Effect.map(($) => $.has(id)))

				if (!exists) {
					return yield* Effect.fail(
						new SimulatorHandshakeError({ id, message: "Not connected" }),
					)
				}

				yield* Ref.set(current, Option.some(id))
			})

		const get = (id: SimulatorId) =>
			Ref.get(live).pipe(Effect.map(($) => $.get(id)))

		return {
			discovered,
			live,
			current,
			connect,
			promote,
			get,
		}
	}),
)

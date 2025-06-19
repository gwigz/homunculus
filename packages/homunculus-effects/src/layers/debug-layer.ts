import { Config, Context, Effect, Layer, PubSub, Queue, Schedule } from "effect"

export interface DebugMessage {
	readonly timestamp: number
	readonly category: string
	readonly data: unknown
}

export interface DebugService {
	/** Publish a debug message */
	readonly publish: (msg: DebugMessage) => Effect.Effect<void>
}

export class Debug extends Context.Tag("homunculus/Debug")<
	Debug,
	DebugService
>() {}

export interface DebugLayerConfig {
	readonly port?: number // WebSocket port (default 35555)
}

export const DebugLive = Layer.effect(
	Debug,
	Effect.gen(function* () {
		const port = yield* Config.integer("DEBUG_PORT").pipe(
			Config.withDefault(35_555),
		)

		// central hub for in-process subscriptions
		const hub = yield* PubSub.unbounded<DebugMessage>()

		// queue used to fan-out to WebSocket clients
		const outbound = yield* Queue.unbounded<DebugMessage>()

		// spin up the WebSocket server when running under Bun
		if (typeof Bun !== "undefined" && "serve" in Bun) {
			const clients = new Set<Bun.ServerWebSocket<unknown>>()

			const html = yield* Effect.tryPromise(() =>
				Bun.file(new URL("./static/index.html", import.meta.url)).text(),
			)

			// track connected WebSocket clients
			Bun.serve({
				port,
				fetch(request, server) {
					console.log("fetch", request.url)

					if (request.url.includes("/ws") && server.upgrade(request)) {
						return new Response(undefined, { status: 101 })
					}

					return new Response(html, {
						headers: { "content-type": "text/html; charset=utf-8" },
					})
				},
				websocket: {
					open(ws) {
						clients.add(ws)
					},
					close(ws) {
						clients.delete(ws)
					},
					message() {
						// read-only for now
					},
				},
			})

			console.log(`Debug server running on http://localhost:${port}`)

			// worker fibre that forwards messages from `outbound` to clients
			yield* Effect.forkDaemon(
				Effect.repeat(
					Effect.gen(function* () {
						const msg = yield* Queue.take(outbound)

						const json = JSON.stringify(msg, (_key, value) =>
							typeof value === "bigint" ? value.toString() : value,
						)

						for (const ws of clients) {
							try {
								ws.send(json)
							} catch {}
						}
					}),
					Schedule.forever,
				),
			)
		}

		// service implementation
		const publish = (msg: DebugMessage) =>
			Effect.gen(function* () {
				// Local subscribers
				yield* hub.publish(msg)
				// WebSocket broadcast (fire & forget)
				yield* Queue.offer(outbound, msg)
			})

		return { publish } satisfies DebugService
	}),
)

/**
 * Disabled / no-op layer – useful as a default so that user code can assume
 * a `Debug` service is present without actually incurring any overhead.
 */
export const DebugDisabled = Layer.succeed(Debug, {
	publish: () => Effect.succeed(undefined),
})

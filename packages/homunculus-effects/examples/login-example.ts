import { Effect, Logger, LogLevel } from "effect"
import { login } from "../src/io/login"
import { Registry, RegistryLive } from "../src/layers/registry-layer"

const program = Effect.gen(function* () {
	const registry = yield* Registry
	const loginResponse = yield* login

	const simulator = yield* registry.connect({
		simIp: loginResponse.simIp,
		simPort: loginResponse.simPort,
		circuitCode: loginResponse.circuitCode,
	})

	// make this the active circuit once the simulator is ready
	yield* registry.promote(simulator.id).pipe(simulator.ready.whenOpen)

	console.log("Connected to simulator", simulator.id)

	// TODO: state machine for the connection? we need to handle
	// sending UseCircuitCode, CompleteAgentMovement, RegionHandshakeReply, etc.
	// https://wiki.secondlife.com/wiki/Login_sequence

	// import * as UseCircuitCode from "../src/codec/generated/packets/use-circuit-code"

	// simulator.socket.send(

	// UseCircuitCode.encode(sequence, true, {
	// 	circuitCode: {
	// 		code: loginResponse.circuitCode,
	// 		sessionId: loginResponse.sessionId,
	// 		id: loginResponse.circuitCode,
	// 	},
	// })

	// TODO: simulator needs maybe it's own UDP, Capabilities, and EQ fibers

	// TODO: we need to be ready to receive packets, over the queue,
	// and we need to be able to send packets, over the socket
	// before we can even do the handshake...

	console.log("Promoted simulator", simulator.id, "to current circuit")
})

// Provide our program with the live registry implementation and run it.
Effect.runPromise(
	program.pipe(
		Effect.provide(RegistryLive),
		Logger.withMinimumLogLevel(LogLevel.Debug),
	),
)

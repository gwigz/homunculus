import { Effect, Logger, LogLevel } from "effect"
import { login } from "../src/io/login"
import {
	Registry,
	RegistryLive,
	type SimulatorInfo,
} from "../src/layers/registry-layer"

const program = Effect.gen(function* () {
	const registry = yield* Registry
	const loginResponse = yield* login

	const simulatorInfo: SimulatorInfo = {
		simIp: loginResponse.simIp,
		simPort: loginResponse.simPort,
		circuitCode: loginResponse.circuitCode,
		agentId: loginResponse.agentId,
		sessionId: loginResponse.sessionId,
	}

	console.log(
		"Connecting to simulator",
		simulatorInfo.simIp,
		simulatorInfo.simPort,
	)

	const simulator = yield* registry.connect(simulatorInfo)

	console.log("Connected to simulator", simulator.id)

	yield* registry.promote(simulatorInfo)

	// .pipe(simulator.ready.whenOpen)

	console.log("Promoted simulator", simulator.id, "to current circuit")
})

// Provide our program with the live registry implementation and run it.
Effect.runPromise(
	program.pipe(
		Effect.provide(RegistryLive),
		Logger.withMinimumLogLevel(LogLevel.Debug),
	),
)

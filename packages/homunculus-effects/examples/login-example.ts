import { Effect, Logger, LogLevel } from "effect"
import { login } from "../src/io/login"

const program = Effect.gen(function* () {
	console.log("Starting login")

	const result = yield* login

	console.log("Login result", result)
})

Effect.runPromise(program.pipe(Logger.withMinimumLogLevel(LogLevel.Debug)))

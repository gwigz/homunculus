import crypto from "node:crypto"
import os from "node:os"
// @ts-expect-error no types available for this module
import { machineIdSync } from "@usebruno/node-machine-id"
import { Data, Duration, Effect, pipe, Redacted, Schema } from "effect"
import { loginConfig } from "../../config"
import { LoginResponse } from "./schema"
import { xmlRpc } from "./xmlrpc"

export class BadCredentialsError extends Data.TaggedError(
	"BadCredentialsError",
)<{
	readonly message: string
}> {}

export class MfaRequiredError extends Data.TaggedError("MfaRequiredError")<{
	readonly message: string
}> {}

export class LoginTimeoutError extends Data.TaggedError("LoginTimeoutError")<{
	readonly message: string
}> {}

export class UnknownLoginError extends Data.TaggedError("UnknownLoginError")<{
	readonly message: string
	readonly cause?: unknown
}> {}

const CHANNEL = "homunculus"
const VERSION = "0.0.0"
const VIEWER_DIGEST = "31570be3-0bd1-4bf2-abf9-1a915a395b85"

const DEFAULT_LOGIN_OPTIONS = [
	"inventory-root",
	"inventory-skeleton",
	"buddy-list",
	"login-flags",
]

function getPlatformAbbreviation(platform: NodeJS.Platform) {
	switch (platform) {
		case "darwin":
			return "mac"
		case "linux":
			return "lnx"
		case "win32":
			return "win"
		default:
			return "lnx"
	}
}

function getActiveMacAddress() {
	const interfaces = os.networkInterfaces()

	for (const ifName in interfaces) {
		for (const iface of interfaces[ifName] ?? []) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.mac
			}
		}
	}

	return "00:00:00:00:00:00"
}

function hashPassword(password: string) {
	return "$1$".concat(
		crypto
			.createHash("md5")
			.update(
				// NOTE: passwords are for some reason still truncated to 16 characters
				password.substring(0, 16),
			)
			.digest("hex"),
	)
}

function hashMachineId() {
	return crypto.createHash("md5").update(machineIdSync()).digest("hex")
}

export const login = pipe(
	Effect.gen(function* () {
		const config = yield* loginConfig
		const [first, last] = config.username.split(" ")

		const parameters = {
			first,
			last: last || "Resident",
			passwd: hashPassword(Redacted.value(config.password)),
			token: config.mfaToken ? Redacted.value(config.mfaToken) : undefined,
			mfa_hash: config.mfaHash ? Redacted.value(config.mfaHash) : undefined,
			start: config.start ?? "last",
			channel: CHANNEL,
			version: VERSION,
			platform: getPlatformAbbreviation(os.platform()),
			mac: getActiveMacAddress(),
			id0: hashMachineId(),
			agree_to_tos: config.agreeToTos,
			read_critical: config.readCritical,
			viewer_digest: VIEWER_DIGEST,
			options: [
				...DEFAULT_LOGIN_OPTIONS,
				...(config.additionalLoginOptions ?? []),
			],
		}

		return yield* xmlRpc(
			config.url.toString(),
			"login_to_simulator",
			parameters,
			{ "User-Agent": `${parameters.channel} ${parameters.version}` },
		).pipe(
			Effect.timeoutFail({
				duration: Duration.seconds(10),
				onTimeout: () => new LoginTimeoutError({ message: "Login timed out" }),
			}),
			Effect.catchTag("XmlRpcNetworkError", (error) =>
				Effect.fail(
					new UnknownLoginError({ message: "Network error", cause: error }),
				),
			),
			Effect.flatMap(Schema.decodeUnknown(LoginResponse)),
		)
	}),
	Effect.catchTag("ParseError", (error) =>
		Effect.fail(
			new UnknownLoginError({
				message: "Unable to parse login response",
				cause: error,
			}),
		),
	),
	Effect.filterOrFail(
		(response) => response.login === true,
		({ reason, message = "Login failed" }) => {
			switch (reason) {
				case "mfa_challenge":
					return new MfaRequiredError({ message })
				case "key":
					return new BadCredentialsError({ message })
				default:
					return new UnknownLoginError({ message })
			}
		},
	),
	Effect.withLogSpan("login"),
)

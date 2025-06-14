import crypto from "node:crypto"
import os from "node:os"
// @ts-expect-error no types
import { machineIdSync } from "@usebruno/node-machine-id"
import { loginResponseSchema } from "~/schema"
import { Constants } from "~/utilities"
import { xmlRpc } from "./xmlrpc"

export interface AuthenticatorOptions {
	username: string
	password: string
	start?: "home" | "last" | string
	mfaToken?: string
	mfaTokenHash?: string
	additionalLoginOptions?: string[]
}

export class Authenticator {
	private readonly channel: string
	private readonly version: string
	private readonly agent: string

	constructor(channel: string, version: string) {
		this.channel = channel
		this.version = version
		this.agent = `${channel} ${version}`
	}

	public async login(options: AuthenticatorOptions) {
		const platforms = { darwin: "mac", linux: "lnx", win32: "win" }
		const platform = os.platform()

		const passwd = crypto
			.createHash("md5")
			.update(options.password.substring(0, 16))
			.digest("hex")

		const id0 = crypto.createHash("md5").update(machineIdSync()).digest("hex")

		const parameters = {
			first: options.username.split(" ")[0],
			last: options.username.split(" ")[1] || "Resident",
			passwd: `$1$${passwd}`,
			token: options.mfaToken || process.env.SL_MFA_TOKEN,
			mfa_hash: options.mfaTokenHash || process.env.SL_MFA_HASH,
			start: options.start || "last",
			channel: this.channel,
			version: this.version,
			platform:
				platform in platforms
					? platforms[platform as keyof typeof platforms]
					: platforms.linux,
			mac: this.getActiveMacAddress() || "00:00:00:00:00:00",
			id0,
			agree_to_tos: process.env.SL_AGREE_TO_TOS === "true",
			read_critical: process.env.SL_READ_CRITICAL === "true",
			viewer_digest: "31570be3-0bd1-4bf2-abf9-1a915a395b85",
			options: [
				"inventory-root",
				"inventory-skeleton",
				"buddy-list",
				"login-flags",
				...(options.additionalLoginOptions ?? []),
			],
		}

		const response = await xmlRpc(
			Constants.Endpoints.LOGIN_URL,
			"login_to_simulator",
			parameters,
			{ "User-Agent": this.agent },
		)

		return loginResponseSchema.parse(response)
	}

	private getActiveMacAddress() {
		const interfaces = os.networkInterfaces()

		for (const interfaceName in interfaces) {
			for (const iface of interfaces[interfaceName] ?? []) {
				if (iface.family === "IPv4" && !iface.internal) {
					return iface.mac
				}
			}
		}

		return null
	}
}

import crypto from "node:crypto"
import os from "node:os"
import xmlrpc from "xmlrpc"

import { UUID } from "../network/types"
import { Constants } from "../utilities"

class Authenticator {
	private readonly channel: string
	private readonly version: string
	private readonly agent: string
	private readonly digest: string

	constructor(channel: string, version: string) {
		this.channel = channel
		this.version = version
		this.agent = `${channel} ${version}`

		// TODO: figure out better method of doing this, for callers file?
		this.digest = crypto
			.createHash("md5")
			.update(JSON.stringify(require("../../package.json")))
			.digest("hex")
	}

	public login(
		username: string,
		password: string,
		start: "first" | "last" | string = "last",
	): Promise<any> {
		const platforms = {
			darwin: "Mac",
			linux: "Lin",
			win32: "Win",
		}

		const platform = os.platform()

		const options = [
			"inventory-root",
			"inventory-skeleton",
			"buddy-list",
			"login-flags",
			"adult_compliant",
		]

		const passwd = crypto
			.createHash("md5")
			.update(password.substr(0, 16))
			.digest("hex")

		const parameters = {
			first: username.split(" ")[0],
			last: username.split(" ")[1] || "Resident",
			passwd: `$1$${passwd}`,
			start: start,
			channel: this.channel,
			version: this.version,
			platform:
				platform in platforms
					? platforms[platform as keyof typeof platforms]
					: "Lin",
			mac: this.getActiveMacAddress() || UUID.zero,
			id0: UUID.zero,
			agree_to_tos: true, // TODO: handle this client-side
			read_critical: true, // TODO: handle this client-side
			viewer_digest: this.digest,
			options: options,
		}

		const client = xmlrpc.createSecureClient({
			url: Constants.Endpoints.LOGIN_URL,
			headers: { "User-Agent": this.agent },
			rejectUnauthorized: false, // TODO: bundle cert
		})

		return new Promise((resolve) => {
			client.methodCall(
				"login_to_simulator",
				[parameters],
				(error, response) => {
					resolve(error || response)
				},
			)
		})
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

export default Authenticator

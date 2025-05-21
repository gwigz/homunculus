import crypto from "node:crypto"
import os from "node:os"
import { machineIdSync } from "node-machine-id"
import xmlrpc from "xmlrpc"
import { Constants } from "../utilities"

class Authenticator {
	private readonly channel: string
	private readonly version: string
	private readonly agent: string

	constructor(channel: string, version: string) {
		this.channel = channel
		this.version = version
		this.agent = `${channel} ${version}`
	}

	public login(
		username: string,
		password: string,
		start: "first" | "last" | string = "last",
	): Promise<any> {
		const platforms = { darwin: "mac", linux: "lnx", win32: "win" }
		const platform = os.platform()

		const passwd = crypto
			.createHash("md5")
			.update(password.substring(0, 16))
			.digest("hex")

		const id0 = crypto.createHash("md5").update(machineIdSync()).digest("hex")

		const parameters = {
			first: username.split(" ")[0],
			last: username.split(" ")[1] || "Resident",
			passwd: `$1$${passwd}`,
			start,
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
			],
		}

		const client = xmlrpc.createSecureClient({
			url: Constants.Endpoints.LOGIN_URL,
			headers: { "User-Agent": this.agent },
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

import assert from "node:assert"
import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import { Authenticator, Core } from "./network"
import type { LoginOptions } from "./network/authenticator"
import type { Packet } from "./network/packets"
import { Nearby } from "./structures"
import Regions from "./structures/regions"
import Self from "./structures/self"
import { Constants } from "./utilities"

export interface ClientEvents {
	[Constants.ClientEvents.READY]: []
	[Constants.ClientEvents.DEBUG]: [message: string]
	[Constants.ClientEvents.ERROR]: [error: Error]
	[Constants.ClientEvents.WARNING]: [warning: string]
}

export interface ClientOptions {
	login?: LoginOptions
}

/**
 * The starting point for the Homunculus client.
 */
export class Client extends AsyncEventEmitter<ClientEvents> {
	/**
	 * Contains values relating to your own avatar.
	 */
	public self?: Self

	/**
	 * Regions we are currently connected to, or recently have been.
	 */
	public regions = new Regions()

	public readonly nearby: Nearby

	private core: Core

	/**
	 * The interface for first circuit creation, via. XMLRPC authentication.
	 */
	private authenticator: Authenticator = new Authenticator(
		"homunculus",
		"0.0.0",
	)

	constructor() {
		super()

		this.core = new Core(this)
		this.nearby = new Nearby(this)

		// parcel
		// friends
		// groups
		// inventory
		//
		// https://gist.github.com/gwigz/0c13179591a3d005eb4765a3bfe9fc3d
	}

	get status() {
		return this.core.status
	}

	/**
	 * The Region representing the current region, as in the region that this
	 * agent is standing within. Note that once teleporting is functional this
	 * value will be overwritten with a new object, watch the "teleport" event
	 * to avoid any potential issues.
	 */
	// get region() {
	// 	return this.agent.region
	// }

	/**
	 * The Parcel representing the current parcel, as in the parcel that this
	 * agent is standing within.
	 */
	// get parcel() {
	// 	return this.agent.parcel
	// }

	/**
	 * @param options.login.start `home`, `last`, or alternatively use `uri:Region Name&x&y&z`.
	 */
	public async connect(
		username = process.env.SL_USERNAME,
		password = process.env.SL_PASSWORD,
		options: ClientOptions = {},
	) {
		options.login = { ...options.login, start: process.env.SL_START }

		assert(
			this.status >= Constants.Status.IDLE,
			Constants.Errors.ALREADY_CONNECTED,
		)

		assert(typeof username === "string", Constants.Errors.INVALID_LOGIN)
		assert(typeof password === "string", Constants.Errors.INVALID_LOGIN)

		assert(
			options.login?.start
				? /^(?:uri:[A-Za-z0-9 ]+&\d{1,3}&\d{1,3}&\d{1,4}|home|last)$/.test(
						options.login.start,
					)
				: true,
			Constants.Errors.INVALID_START,
		)

		this.emit(
			Constants.ClientEvents.DEBUG,
			`Attempting login using username "${username}"...`,
		)

		const response = await this.authenticator.login(
			username,
			password,
			options.login,
		)

		assert(typeof response === "object", Constants.Errors.LOGIN_FAILED)

		if (response.message) {
			this.emit(Constants.ClientEvents.DEBUG, response.message)
		}

		assert(
			"circuit_code" in response,
			'Missing "circuit_code" in login response',
		)

		assert(
			typeof response.circuit_code === "number",
			'Invalid "circuit_code" in response',
		)

		assert("agent_id" in response, 'Missing "agent_id" in login response')

		assert(
			typeof response.agent_id === "string",
			'Invalid "agent_id" in response',
		)

		assert("session_id" in response, 'Missing "session_id" in login response')

		assert(
			typeof response.session_id === "string",
			'Invalid "session_id" in login response',
		)

		assert("sim_ip" in response, 'Missing "sim_ip" in login response')

		assert(
			typeof response.sim_ip === "string",
			'Invalid "sim_ip" in login response',
		)

		assert("sim_port" in response, 'Missing "sim_port" in login response')

		assert(
			typeof response.sim_port === "number",
			'Invalid "sim_port" in login response',
		)

		this.self = new Self(this, {
			key: response.agent_id,
			session: response.session_id,
			firstName:
				"first_name" in response
					? response.first_name.replace('"', "")
					: undefined,
			lastName:
				"last_name" in response
					? response.last_name.replace('"', "")
					: undefined,
		})

		/**
		 * inventory-root: [{ folder_id }],
		 * inventory-skeleton: [{ name, folder_id, parent_id, type_default, version }],
		 * buddy-list: [{ buddy_id, buddy_rights_has, buddy_rights_given }]
		 * look_at: "[r-0.0121346,r0.998734,r0.0488137]",
		 * region_x: 272128,
		 * region_y: 334080,
		 * home: "{'region_handle':[r123, r123], 'position':[r130.5, r170.75, r22.25], 'look_at':[r0.0, r1.0, r0.0]}",
		 * seed_capability: "https://simhost..."
		 */

		return this.core.handshake({
			id: response.circuit_code,
			address: response.sim_ip,
			port: response.sim_port,
		})
	}

	/**
	 * Sends Packet (or multiple) to currently active Circuit.
	 *
	 * @param packets Packets to send
	 */
	public send(packets: Array<Packet>) {
		return this.core.circuit?.send(packets)
	}

	/**
	 * Sends Packet (or multiple) to currently active Circuit.
	 *
	 * @param packets Packets to send
	 * @param timeout Timeout for reliable packets
	 */
	public sendReliable(packets: Array<Packet>, timeout = 10_000) {
		return this.core.circuit?.sendReliable(packets, timeout)
	}

	public async disconnect() {
		await this.core.disconnect()

		this.emit(Constants.ClientEvents.DEBUG, "Disconnected!")
	}
}

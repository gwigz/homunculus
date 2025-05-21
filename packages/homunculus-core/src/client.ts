import assert from "node:assert"
import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import { Authenticator, Core } from "./network"
import type { Packet } from "./network/packets"
import { Agent, Nearby, type Region } from "./structures"
import { Constants } from "./utilities"

export interface ClientEvents {
	[Constants.ClientEvents.READY]: []
	[Constants.ClientEvents.DEBUG]: [message: string]
	[Constants.ClientEvents.ERROR]: [error: Error]
	[Constants.ClientEvents.WARNING]: [warning: string]
}

/**
 * The starting point for the Homunculus client.
 * @extends {EventEmitter}
 */
class Client extends AsyncEventEmitter<ClientEvents> {
	/**
	 * The Agent representing the logged in Client, becomes fully functional
	 * after ready event is emitted.
	 *
	 * @type {?Agent}
	 */
	public agent?: Agent

	public regions: Map<string, Region>

	public readonly nearby: Nearby

	private core: Core
	private authenticator: Authenticator

	constructor() {
		super()

		/**
		 * @type {Core}
		 * @private
		 */
		this.core = new Core(this)

		/**
		 * The interface for first circuit creation, via. XMLRPC authentication.
		 *
		 * @type {Authenticator}
		 * @private
		 */
		this.authenticator = new Authenticator("homunculus", "0.0.0")

		/**
		 * Regions we are currently connected to, or recently have been.
		 */
		this.regions = new Map()

		/**
		 * The nearby helper, becomes fully functional after ready event is emitted.
		 *
		 * @name Client#nearby
		 * @type {Nearby}
		 * @readonly
		 */
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
	 *
	 * @returns {Region|null}
	 */
	// get region() {
	// 	return this.agent.region
	// }

	/**
	 * The Parcel representing the current parcel, as in the parcel that this
	 * agent is standing within.
	 *
	 * @returns {?Parcel}
	 */
	// get parcel() {
	// 	return this.agent.parcel
	// }

	/**
	 * @param {string} username
	 * @param {string} password
	 * @param {string} start Alternatively use "uri:Region Name&x&y&z"
	 * @returns {?Promise} Complete upon handshake sent, use ready event instead
	 */
	public async connect(
		username: string,
		password: string,
		start: "first" | "last" | string = "last",
	) {
		assert(
			this.status >= Constants.Status.IDLE,
			Constants.Errors.ALREADY_CONNECTED,
		)

		assert(typeof username === "string", Constants.Errors.INVALID_LOGIN)
		assert(typeof password === "string", Constants.Errors.INVALID_LOGIN)

		this.emit(
			Constants.ClientEvents.DEBUG,
			`Attempting login using username "${username}"...`,
		)

		const response = await this.authenticator.login(username, password, start)

		assert(typeof response === "object", Constants.Errors.LOGIN_FAILED)

		if (response.message) {
			this.emit(Constants.ClientEvents.DEBUG, response.message)
		}

		assert("circuit_code" in response, 'Missing "circuit_code" in response')

		assert(
			typeof response.circuit_code === "number",
			'Invalid "circuit_code" in response',
		)

		assert("agent_id" in response, 'Missing "agent_id" in response')

		assert(
			typeof response.agent_id === "string",
			'Invalid "agent_id" in response',
		)

		assert("session_id" in response, 'Missing "session_id" in response')

		assert(
			typeof response.session_id === "string",
			'Invalid "session_id" in response',
		)

		assert("sim_ip" in response, 'Missing "sim_ip" in response')

		assert(typeof response.sim_ip === "string", 'Invalid "sim_ip" in response')

		assert("sim_port" in response, 'Missing "sim_port" in response')

		assert(
			typeof response.sim_port === "number",
			'Invalid "sim_port" in response',
		)

		this.agent = new Agent(this, {
			id: response.agent_id,
			session: response.session_id,
			key: response.circuit_code,
			firstname:
				"first_name" in response
					? response.first_name.replace('"', "")
					: undefined,
			lastname:
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
	 * @param {..Packet} packets Packets to send
	 * @returns {Promise}
	 */
	public send(...packets: Array<Packet>) {
		assert(!!this.core.circuit, Constants.Errors.NOT_CONNECTED)

		return this.core.circuit.send(...packets)
	}

	public async disconnect() {
		await this.core.disconnect()

		this.emit(Constants.ClientEvents.DEBUG, "Disconnected!")
	}
}

export default Client

/**
 * Emitted for general warnings.
 * @event Client#warning
 * @param {string} info The warning
 */

/**
 * Emitted for debugging information.
 * @event Client#debug
 * @param {string} info The debug information
 */

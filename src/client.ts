import assert from "node:assert"
import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import { Authenticator, Core } from "./network"
import type { Packet } from "./network/packets"
import { Agent, Nearby, type Parcel, type Region } from "./structures"
import { Collection, Constants } from "./utilities"

export interface ClientEvents {
	ready: []
	debug: [message: string]
	error: [error: Error]
	warning: [warning: string]
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

	public regions: Collection<string, Region>

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
		 *
		 * @type {Collection}
		 */
		this.regions = new Collection()

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
		if (this.status < Constants.Status.IDLE) {
			throw new Error(Constants.Errors.ALREADY_CONNECTED)
		}

		if (typeof username !== "string") {
			throw new Error(Constants.Errors.INVALID_LOGIN)
		}

		if (typeof password !== "string") {
			throw new Error(Constants.Errors.INVALID_LOGIN)
		}

		this.emit(
			Constants.Events.DEBUG,
			`Attempting login using username "${username}"...`,
		)

		const response = await this.authenticator.login(username, password, start)

		assert(typeof response === "object", Constants.Errors.LOGIN_FAILED)

		if (response.message) {
			this.emit(Constants.Events.DEBUG, response.message)
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
		})

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
		if (this.core.circuit === undefined) {
			throw new Error(Constants.Errors.NOT_CONNECTED)
		}

		return this.core.circuit.send(...packets)
	}

	public async disconnect() {
		await this.core.disconnect()

		this.emit(Constants.Events.DEBUG, "Disconnected!")
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

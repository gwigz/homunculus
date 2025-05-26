import assert from "node:assert"
import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import { Authenticator, Core } from "./network"
import type { LoginOptions } from "./network/authenticator"
import type { Packet } from "./network/packets"
import { Vector3 } from "./network/types"
import { Nearby, type Region } from "./structures"
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
	public readonly regions = new Regions()

	/**
	 * The Region representing the current region, as in the region that this
	 * agent is standing within.
	 *
	 * @note Once teleporting is functional this value will be overwritten with a
	 * new object. Watch the "teleport" event to avoid any potential issues, or
	 * always use `client.region` rather than storing a reference to this value.
	 */
	public region?: Region

	public readonly nearby: Nearby

	private readonly core: Core

	/**
	 * The interface for first circuit creation, via. XMLRPC authentication.
	 */
	private readonly authenticator: Authenticator = new Authenticator(
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

		if (!response.login) {
			throw new Error(response.message)
		}

		if (response.message) {
			this.emit(Constants.ClientEvents.DEBUG, response.message)
		}

		this.self = new Self(this, {
			key: response.agentId,
			session: response.sessionId,
			firstName: response.firstName,
			lastName: response.lastName,
			lookAt: response.lookAt,
			offset: new Vector3(response.regionX ?? 0, response.regionY ?? 0, 0),
		})

		await this.core.handshake({
			id: response.circuitCode,
			address: response.simIp,
			port: response.simPort,
		})

		return response
	}

	/**
	 * Sends Packet (or multiple) to currently active Circuit.
	 *
	 * @param packets Packets to send
	 */
	public send(packets: Array<Packet<any>>) {
		return this.core.circuit?.send(packets)
	}

	/**
	 * Sends Packet (or multiple) to currently active Circuit.
	 *
	 * @param packets Packets to send
	 * @param timeout Timeout for reliable packets
	 */
	public sendReliable(packets: Array<Packet<any>>, timeout = 10_000) {
		return this.core.circuit?.sendReliable(packets, timeout)
	}

	public async disconnect() {
		await this.core.disconnect()

		this.emit(Constants.ClientEvents.DEBUG, "Disconnected!")
	}
}

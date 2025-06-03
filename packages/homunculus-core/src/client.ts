import assert from "node:assert"
import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import { type AuthenticatorOptions, Core, Vector3 } from "./network"
import { loginOptionsSchema } from "./schema/environment-schema"
import { services } from "./services"
import { Friends, Nearby, Region } from "./structures"
import { InstantMessages } from "./structures/instant-messages"
import { Regions } from "./structures/regions"
import { Self } from "./structures/self"
import { Constants } from "./utilities"

interface DebugHandlers {
	debug?: (message: string) => void
	warn?: (warn: string) => void
	error?: (error: Error) => void
}

export interface ClientEvents {
	[Constants.ClientEvents.READY]: []
	[Constants.ClientEvents.DEBUG]: [message: string]
	[Constants.ClientEvents.ERROR]: [error: Error]
	[Constants.ClientEvents.WARN]: [warning: string]
	[Constants.ClientEvents.CONNECTING]: []
	[Constants.ClientEvents.RECONNECTING]: []
	[Constants.ClientEvents.DISCONNECTING]: []
	[Constants.ClientEvents.DISCONNECTED]: []
}

/**
 * The starting point for the Homunculus client.
 */
export class Client extends AsyncEventEmitter<ClientEvents> {
	/**
	 * Contains values relating to your own avatar.
	 */
	public get self() {
		assert(this._self, "Self is not initialized")

		return this._self
	}

	public set self(value: Self) {
		this._self = value
	}

	/**
	 * Regions we are currently connected to, or recently have been.
	 */
	public readonly regions = new Regions()

	/**
	 * Friends interface.
	 */
	public readonly friends: Friends

	/**
	 * Instant messaging interface.
	 */
	public readonly instantMessages: InstantMessages

	/**
	 * Local communication interface.
	 */
	public readonly nearby: Nearby

	/**
	 * The Region representing the current region, as in the region that this
	 * agent is standing within.
	 *
	 * @note Once teleporting is functional this value will be overwritten with a
	 * new object. Always use `client.region` rather than storing a reference to
	 * this value.
	 */
	public get region() {
		return this.regions.current
	}

	/**
	 * The Parcel representing the current parcel, as in the parcel that this
	 * agent is standing within.
	 *
	 * @note This value changes with movement or parcel updates. Always use
	 * `client.parcel` rather than storing a reference to this value.
	 */
	public get parcel() {
		return this.self.parcel
	}

	public get status() {
		return this._core.status
	}

	private readonly _core: Core
	private _self?: Self

	constructor(options?: { logger?: DebugHandlers | false } | undefined) {
		super()

		this._core = new Core(this)

		// parcel
		// friends
		// groups
		// inventory

		this.instantMessages = new InstantMessages(this)
		this.friends = new Friends(this)
		this.nearby = new Nearby(this)

		if (options?.logger !== false) {
			const logger = {
				...options?.logger,
				debug: console.debug,
				warn: console.warn,
				error: console.error,
			}

			if (logger?.debug) {
				this.on(Constants.ClientEvents.DEBUG, logger.debug)
			}

			if (logger?.warn) {
				this.on(Constants.ClientEvents.WARN, logger.warn)
			}

			if (logger?.error) {
				this.on(Constants.ClientEvents.ERROR, logger.error)
			}
		}

		// https://gist.github.com/gwigz/0c13179591a3d005eb4765a3bfe9fc3d
	}

	/**
	 * The Parcel representing the current parcel, as in the parcel that this
	 * agent is standing within.
	 */
	// get parcel() {
	// 	return this.agent.parcel
	// }

	/**
	 * @param [options.login.start] `home`, `last`, or alternatively use `uri:Region Name&x&y&z`.
	 */
	public async connect(options?: AuthenticatorOptions) {
		const credentials = loginOptionsSchema.parse({
			...options,
			username: options?.username || process.env.SL_USERNAME,
			password: options?.password || process.env.SL_PASSWORD,
			start: options?.start || process.env.SL_START,
		})

		this.emit(Constants.ClientEvents.CONNECTING)

		this.emit(
			Constants.ClientEvents.DEBUG,
			`Attempting login using username "${credentials.username}"...`,
		)

		const response = await services.authenticator.login(credentials)

		if (!response.login) {
			throw new Error(response.message)
		}

		if (response.message) {
			this.emit(Constants.ClientEvents.DEBUG, response.message)
		}

		// TODO: load in `response.buddyList` into `this.friends`

		this.self = new Self(this, {
			key: response.agentId,
			sessionId: response.sessionId,
			circuitCode: response.circuitCode,
			firstName: response.firstName,
			lastName: response.lastName,
			lookAt: response.lookAt,
			offset: new Vector3(response.regionX ?? 0, response.regionY ?? 0, 0),
		})

		const handle =
			(BigInt(response.regionX ?? 0) << 32n) | BigInt(response.regionY ?? 0)

		this.regions.set(handle, new Region(this, { handle }, true))

		await this._core.handshake({
			id: response.circuitCode,
			address: response.simIp,
			port: response.simPort,
		})

		// TODO: do we want this to be configurable?
		const exit = async () => {
			await this._core.disconnect()

			process.exit(0)
		}

		process.on("SIGINT", exit)
		process.on("SIGTERM", exit)

		return response
	}

	/**
	 * Sends Packet (or multiple) to currently active Circuit.
	 *
	 * @param packets Packets to send
	 */
	public send(
		...args: Parameters<NonNullable<typeof this._core.circuit>["send"]>
	) {
		assert(this._core.circuit, "Circuit is not initialized")

		this._core.circuit.send(...args)
	}

	/**
	 * Sends Packet (or multiple) to currently active Circuit.
	 *
	 * @param packets Packets to send
	 * @param timeout Timeout for reliable packets
	 */
	public sendReliable(
		...args: Parameters<NonNullable<typeof this._core.circuit>["sendReliable"]>
	) {
		assert(this._core.circuit, "Circuit is not initialized")

		return this._core.circuit.sendReliable(...args)
	}

	public async disconnect() {
		await this._core.disconnect()

		this.emit(Constants.ClientEvents.DEBUG, "Disconnected!")
	}
}

import type { Client } from ".."

import type { Agent, Entities, Region } from "../structures"
import { Collection, Constants } from "../utilities"
import { LogoutRequest } from "./packets"

import Circuit, { type ICircuitOptions } from "./circuit"
import Socket from "./socket"

/**
 * The core handles connecting to a Simulator, processing and sending
 * messages. It's basically handles 100% of the the communication.
 */
class Core {
	public socket: Socket
	public circuits: Collection<string, Circuit>
	public circuit: Circuit
	public status: number

	public readonly client: Client

	/**
	 * @param {Client} client For emiting processed messages back to
	 */
	constructor(client: Client) {
		/**
		 * Client instance that instantiated this Core.
		 *
		 * @name Acknowledger#client
		 * @type {Client}
		 * @readonly
		 */
		Object.defineProperty(this, "client", { value: client })

		/**
		 * The UDP connection/socket.
		 * @type {Socket}
		 */
		this.socket = new Socket(this)

		/**
		 * Collection of recently, and currently in use Circuit instances.
		 * @type {Collection}
		 */
		this.circuits = new Collection()

		/**
		 * Currently active circuit.
		 * @type {?Circuit}
		 */
		this.circuit = null

		/**
		 * The status of this class, a type of Constants.Status, IDLE default.
		 * @type {number}
		 */
		this.status = Constants.Status.IDLE
	}

	get agent(): Agent {
		return this.client.agent
	}

	get region(): Region {
		return this.client.region
	}

	get objects(): Entities {
		return this.client.region.objects
	}

	/**
	 * Sends message to Circuit over UDP socket.
	 *
	 * @param {Circuit} circuit Circuit to send packets too
	 * @param {...Buffer} packets Packet to send
	 * @returns {Promise}
	 */
	public send(
		circuit: Circuit,
		...packets: Array<Buffer>
	): Promise<Array<void>> {
		return Promise.all(
			packets.map((packet) => this.socket.send(circuit, packet)),
		)
	}

	/**
	 * Connects the client to a given circuit code.
	 *
	 * @param {data} ICircuitOptions
	 */
	public handshake(data: ICircuitOptions): Promise<Array<void>> {
		const circuit = new Circuit(this, data)

		this.status = Constants.Status.CONNECTING
		this.circuits.set(`${circuit.address}:${circuit.port}`, circuit)

		if (this.circuit === null) {
			this.circuit = circuit
		}

		this.client.emit(
			Constants.Events.DEBUG,
			"Handshake recieved, creating circuit...",
		)

		return circuit.handshake()
	}

	public ready(): void {
		if (this.status < Constants.Status.CONNECTING) {
			return
		}

		this.status = Constants.Status.READY

		this.client.emit(Constants.Events.DEBUG, "Connected!")
		this.client.emit(Constants.Events.READY)
	}

	/**
	 * Disconnects the client from the current circuit.
	 */
	public disconnect(): void {
		this.circuit.send(new LogoutRequest())
	}
}

export default Core

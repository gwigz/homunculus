import type { Client } from ".."
import { Constants } from "../utilities"
import Circuit, { type ICircuitOptions } from "./circuit"
import { LogoutRequest } from "./packets"
import Socket from "./socket"

/**
 * The core handles connecting to a Simulator, processing and sending
 * messages. It's basically handles 100% of the the communication.
 */
class Core {
	public socket: Socket
	public circuits: Map<string, Circuit>
	public circuit?: Circuit
	public status: number

	/**
	 * @param client For emitting processed messages back to.
	 */
	constructor(
		/** Client instance that instantiated this Core. */
		public readonly client: Client,
	) {
		/**
		 * The UDP connection/socket.
		 */
		this.socket = new Socket(this)

		/**
		 * Collection of recently, and currently in use Circuit instances.
		 */
		this.circuits = new Map()

		/**
		 * The status of this class, a type of Constants.Status, IDLE default.
		 */
		this.status = Constants.Status.IDLE
	}

	get agent() {
		return this.client.agent
	}

	// get region() {
	// 	return this.client.region
	// }

	// get objects(): Entities {
	// 	return this.client.region.objects
	// }

	/**
	 * Sends message to Circuit over UDP socket.
	 *
	 * @param circuit Circuit to send packets too.
	 * @param packets Packet to send.
	 */
	public send(circuit: Circuit, ...packets: Array<Buffer>) {
		return Promise.all(
			packets.map((packet) => this.socket.send(circuit, packet)),
		)
	}

	/**
	 * Connects the client to a given circuit code.
	 */
	public handshake(data: ICircuitOptions) {
		const circuit = new Circuit(this, data)

		this.circuits.set(`${circuit.address}:${circuit.port}`, circuit)

		if (!this.circuit) {
			this.status = Constants.Status.CONNECTING
			this.circuit = circuit
		}

		this.client.emit(
			Constants.ClientEvents.DEBUG,
			"Handshake received, creating circuit...",
		)

		return circuit.handshake()
	}

	public ready() {
		if (this.status < Constants.Status.CONNECTING) {
			return
		}

		this.status = Constants.Status.READY

		this.client.emit(Constants.ClientEvents.DEBUG, "Connected!")
		this.client.emit(Constants.ClientEvents.READY)
	}

	/**
	 * Disconnects the client from the current circuit.
	 */
	public disconnect() {
		this.circuit?.send(new LogoutRequest())
	}
}

export default Core

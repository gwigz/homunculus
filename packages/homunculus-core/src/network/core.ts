import type { Client } from ".."
import { Constants } from "../utilities"
import Circuit, { type CircuitOptions } from "./circuit"
import { LogoutRequest } from "./packets"
import Socket from "./socket"

/**
 * The core handles connecting to a simulator, processing and sending
 * messages.
 */
class Core {
	/**
	 * The UDP connection/socket.
	 */
	public socket: Socket

	/**
	 * Collection of recently, and currently in use Circuit instances.
	 */
	public circuits = new Map<string, Circuit>()

	/**
	 * The currently in use Circuit instance.
	 */
	public circuit?: Circuit

	/**
	 * The status of this class, a type of Constants.Status, IDLE default.
	 */
	public status: number = Constants.Status.IDLE

	/**
	 * @param client For emitting processed messages back to.
	 */
	constructor(
		/** Client instance that instantiated this Core. */
		public readonly client: Client,
	) {
		this.socket = new Socket(this)
	}

	get self() {
		return this.client.self
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
	public send(circuit: Circuit, packets: Array<Buffer>) {
		return packets.map((packet) => this.socket.send(circuit, packet))
	}

	/**
	 * Connects the client to a given circuit code.
	 */
	public handshake(data: CircuitOptions) {
		this.client.emit(
			Constants.ClientEvents.DEBUG,
			"Handshake received, creating circuit...",
		)

		const circuit = new Circuit(this, data)

		this.circuits.set(`${circuit.address}:${circuit.port}`, circuit)

		if (!this.circuit) {
			this.status = Constants.Status.CONNECTING
			this.circuit = circuit
		}

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
	public async disconnect() {
		await this.circuit?.send([new LogoutRequest({})])
	}
}

export default Core

import { Constants } from "~/utilities"
import type { Client } from ".."
import { Circuit, type CircuitOptions } from "./circuit"
import { LogoutRequest } from "./packets"
import Socket from "./socket"

/**
 * The core handles connecting to a simulator, processing and sending
 * messages.
 */
export class Core {
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
	constructor(private readonly client: Client) {
		this.socket = new Socket(client, this)
	}

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

		const circuit = new Circuit(this.client, this, data)

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

		// send initial agent updates, finish animation avoids agent being stuck in
		// a weird squatting animation on login
		this.client.self.controlFlags = Constants.ControlFlags.FINISH_ANIM
		this.client.self.sendAgentUpdate()

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

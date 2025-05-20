import type Long from "long"

import type { Circuit, Core, Packets } from ".."
import type Client from "../../client"
import type { Region } from "../../structures"

class Delegate {
	public readonly circuit: Circuit

	constructor(circuit: Circuit) {
		Object.defineProperty(this, "circuit", { value: circuit })
	}

	get core(): Core {
		return this.circuit.core
	}

	get client(): Client {
		return this.circuit.core.client
	}

	/**
	 * Toggle for avoiding decoding packets we don't care about, for example
	 * ChatFromSimulator will return `false` if no listen events are bound to
	 * the clinets nearby helper.
	 *
	 * @returns {boolean} True if we want to recieve packets, defaulted to true
	 */
	get waiting(): boolean {
		return true
	}

	/**
	 * Handler recieved and parsed Packet objects.
	 *
	 * @param {Packet} packet Parsed packet object
	 */
	public handle(packet: Packets.Packet): void {
		// ...
	}

	/**
	 * Attempts to fetch region by region handle.
	 *
	 * @param {Long} handle Region handle
	 * @returns {?Region}
	 */
	protected region(handle: Long): Region | null {
		// This is kinda ugly, I know.
		return this.client.regions.get(
			`${handle.getHighBits()}${handle.getLowBits()}`,
		)
	}
}

export default Delegate

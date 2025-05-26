import type { Circuit, Packets } from ".."

class Delegate {
	constructor(public readonly circuit: Circuit) {}

	get core() {
		return this.circuit.core
	}

	get client() {
		return this.circuit.core.client
	}

	/**
	 * Toggle for avoiding decoding packets we don't care about, for example
	 * ChatFromSimulator will return `false` if no listen events are bound to
	 * the clients nearby helper.
	 *
	 * @returns True if we want to receive packets, defaulted to true
	 */
	get waiting() {
		return true
	}

	/**
	 * Handler received and parsed Packet objects.
	 */
	public handle(_packet: Packets.Packet<any>) {
		// ...
	}
}

export default Delegate

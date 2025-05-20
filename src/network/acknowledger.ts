import { Collection } from "../utilities"
import { PacketAck } from "./packets"

import type Circuit from "./circuit"

interface IAcknowledgerPackets {
	seen: Collection<number, number>
	queued: Set<number>
}

class Acknowledger {
	public readonly circuit: Circuit

	private acknowledge: PacketAck
	private packets: IAcknowledgerPackets

	constructor(circuit: Circuit) {
		/**
		 * Circuit instance that instantiated this Acknowledger.
		 *
		 * @name Acknowledger#circuit
		 * @type {Circuit}
		 * @readonly
		 */
		Object.defineProperty(this, "circuit", { value: circuit })

		this.acknowledge = new PacketAck({ packets: [] })

		this.packets = {
			seen: new Collection(),
			queued: new Set(),
		}

		setInterval(this.tick.bind(this), 100)
		setInterval(this.prune.bind(this), 1000)
	}

	public seen(number): boolean {
		return this.packets.seen.has(number) || this.packets.queued.has(number)
	}

	public queue(number): void {
		this.packets.queued.add(number)
	}

	public tick(): void {
		if (this.packets.queued.size) {
			const uptime = process.uptime()

			// Clean array, this could probably be done better?
			this.acknowledge.data.packets = []

			for (const sequence of this.packets.queued) {
				this.packets.queued.delete(sequence)
				this.packets.seen.set(sequence, uptime)

				// Not sure if we handle limits correctly here.
				this.acknowledge.data.packets.push({ id: sequence })
			}

			this.circuit.send(this.acknowledge)
		}
	}

	public prune(): void {
		if (!this.packets.seen.size) {
			return
		}

		const uptime = process.uptime()

		for (const [sequence, timestamp] of this.packets.seen) {
			if (uptime - timestamp > 5.0) {
				this.packets.seen.delete(sequence)
			} else {
				break
			}
		}
	}
}

export default Acknowledger

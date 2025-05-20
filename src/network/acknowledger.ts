import { PacketAck } from "./packets"

import type Circuit from "./circuit"

interface IAcknowledgerPackets {
	seen: Map<number, number>
	queued: Set<number>
}

class Acknowledger {
	private acknowledge: PacketAck
	private packets: IAcknowledgerPackets

	constructor(
		/** Circuit instance that instantiated this Acknowledger. */
		public readonly circuit: Circuit,
	) {
		this.acknowledge = new PacketAck({ packets: [] })

		this.packets = {
			seen: new Map(),
			queued: new Set(),
		}

		setInterval(this.tick.bind(this), 100)
		setInterval(this.prune.bind(this), 1000)
	}

	public seen(number: number) {
		return this.packets.seen.has(number) || this.packets.queued.has(number)
	}

	public queue(number: number) {
		this.packets.queued.add(number)
	}

	public tick() {
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

	public prune() {
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

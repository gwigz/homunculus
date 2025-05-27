import type Circuit from "./circuit"
import { PacketAck } from "./packets"

export class AcknowledgeTimeoutError extends Error {
	constructor(label: string) {
		super()

		this.name = "AcknowledgeTimeoutError"
		this.message = `Timed out waiting for "${label}" packet.`
	}
}

class Acknowledger {
	private acknowledge = new PacketAck({ packets: [] })

	private packets = {
		seen: new Map<number, number>(),
		queued: new Set<number>(),
	}

	private awaiting = new Map<
		number,
		[
			resolve: (value: void | PromiseLike<void>) => void,
			timeout: NodeJS.Timeout,
		]
	>()

	private tickInterval?: NodeJS.Timeout
	private pruneInterval?: NodeJS.Timeout

	constructor(
		/** Circuit instance that instantiated this Acknowledger. */
		public readonly circuit: Circuit,
	) {
		this.tickInterval = setInterval(this.tick.bind(this), 50)
		this.pruneInterval = setInterval(this.prune.bind(this), 1000)
	}

	public destroy() {
		clearInterval(this.tickInterval)
		clearInterval(this.pruneInterval)

		this.tickInterval = undefined
		this.pruneInterval = undefined
	}

	public isSequenceNew(number: number) {
		return !this.packets.seen.has(number) && !this.packets.queued.has(number)
	}

	public queueAckResponse(number: number) {
		this.packets.queued.add(number)
	}

	public awaitServerAcknowledgement(
		label: string,
		sequence: number,
		timeout = 10_000,
	) {
		if (this.awaiting.has(sequence)) {
			return this.awaiting.get(sequence)
		}

		return new Promise<void>((resolve, reject) => {
			this.awaiting.set(sequence, [
				resolve,
				setTimeout(() => reject(new AcknowledgeTimeoutError(label)), timeout),
			])
		})
	}

	public handleReceivedAck(number: number) {
		const awaiting = this.awaiting.get(number)

		if (awaiting) {
			const [resolve, timeout] = awaiting

			clearTimeout(timeout)
			resolve()

			this.awaiting.delete(number)
		}
	}

	private tick() {
		if (!this.packets.queued.size) {
			return
		}

		const uptime = process.uptime()

		for (const sequence of this.packets.queued) {
			this.packets.queued.delete(sequence)
			this.packets.seen.set(sequence, uptime)

			this.acknowledge.data.packets!.push({ id: sequence })

			// max 255 packets per message
			if (this.acknowledge.data.packets!.length >= 255) {
				this.circuit.send([this.acknowledge])
				this.acknowledge.data.packets = []
			}
		}

		if (this.acknowledge.data.packets!.length) {
			this.circuit.send([this.acknowledge])
			this.acknowledge.data.packets = []
		}
	}

	private prune() {
		if (!this.packets.seen.size) {
			return
		}

		const uptime = process.uptime()

		for (const [sequence, timestamp] of this.packets.seen) {
			if (uptime - timestamp > 10) {
				this.packets.seen.delete(sequence)
			} else {
				break
			}
		}
	}
}

export default Acknowledger

import assert from "node:assert"
import type { Circuit, Packet } from "~/network"
import { packets } from "~/network"

export class AcknowledgeTimeoutError extends Error {
	constructor(label: string) {
		super()

		this.name = "AcknowledgeTimeoutError"
		this.message = `Timed out waiting for "${label}" packet.`
	}
}

class DeferredAcknowledgePromise<T = void> {
	public readonly promise: Promise<T>

	public resolve!: (value: T | PromiseLike<T>) => void
	public reject!: (reason?: any) => void

	private timeout?: NodeJS.Timeout

	private retries = 0
	private retryInterval?: NodeJS.Timeout

	constructor(circuit: Circuit, packet: Packet<any>, timeout: number) {
		assert(timeout >= 1000, "Timeout must be at least 1000ms")

		this.promise = new Promise<T>((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject

			this.timeout = setTimeout(() => {
				this.cleanup()
				this.reject(new AcknowledgeTimeoutError(packet.metadata.name))
			}, timeout)

			const retryInterval = Math.min(1000, timeout / 3)
			const maxRetries = Math.floor(timeout / retryInterval)

			if (maxRetries > 0) {
				this.retryInterval = setInterval(() => {
					this.retries++

					if (this.retries > maxRetries) {
						this.cleanup()
						this.reject(new AcknowledgeTimeoutError(packet.metadata.name))
					} else {
						circuit.sendReliableWithRetries(packet, this.retries)
					}
				}, retryInterval)
			}
		})
	}

	public cleanup() {
		clearTimeout(this.timeout)
		clearInterval(this.retryInterval)

		this.timeout = undefined
		this.retryInterval = undefined
	}
}

export class Acknowledger {
	private acknowledge = packets.packetAck({ packets: [] })

	private packets = {
		// TODO: consider an array that only stores last n packets
		seen: new Map<number, number>(),
		queued: new Set<number>(),
	}

	private awaiting = new Map<number, DeferredAcknowledgePromise>()

	private tickInterval?: NodeJS.Timeout
	private pruneInterval?: NodeJS.Timeout

	constructor(
		/** Circuit instance that instantiated this Acknowledger. */
		public readonly circuit: Circuit,
	) {
		this.tickInterval = setInterval(this.processAckQueue.bind(this), 50)
		this.pruneInterval = setInterval(this.removeOldPackets.bind(this), 1000)
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
		packet: Packet<any>,
		sequence: number,
		timeout = 10_000,
	) {
		if (this.awaiting.has(sequence)) {
			return this.awaiting.get(sequence)!.promise
		}

		const deferred = new DeferredAcknowledgePromise(
			this.circuit,
			packet,
			timeout,
		)

		this.awaiting.set(sequence, deferred)

		return deferred.promise
	}

	public handleReceivedAck(number: number) {
		const deferred = this.awaiting.get(number)

		if (deferred) {
			deferred.cleanup()
			deferred.resolve()

			this.awaiting.delete(number)
		}
	}

	private async processAckQueue() {
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
				await this.circuit.send([this.acknowledge])

				this.acknowledge.data.packets = []
			}
		}

		if (this.acknowledge.data.packets!.length) {
			await this.circuit.send([this.acknowledge])

			this.acknowledge.data.packets = []
		}
	}

	private removeOldPackets() {
		const uptime = process.uptime()

		for (const [sequence, timestamp] of this.packets.seen) {
			if (uptime - timestamp > 10) {
				this.packets.seen.delete(sequence)
			} else {
				// rest of the packets are probably still valid
				break
			}
		}
	}
}

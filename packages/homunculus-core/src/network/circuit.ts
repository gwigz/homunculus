import assert from "node:assert"
import { Constants } from "../utilities"
import Acknowledger from "./acknowledger"
import type Core from "./core"
import * as Delegates from "./delegates"
import Deserializer from "./deserializer"
import type { PacketBuffer } from "./helpers"
import { CompleteAgentMovement, type Packet, UseCircuitCode } from "./packets"
import Serializer from "./serializer"

export interface CircuitOptions {
	id: number
	address: string
	port: number
}

class Circuit {
	public readonly id: number
	public readonly address: string
	public readonly port: number

	public readonly acknowledger = new Acknowledger(this)
	public readonly deserializer = new Deserializer()
	public readonly serializer = new Serializer(this)

	protected delegates: Record<string, Delegates.Delegate> = {}
	protected dead = true

	constructor(
		/** Core instance that instantiated this Circuit. */
		public readonly core: Core,
		data: CircuitOptions,
	) {
		this.id = data.id
		this.address = data.address
		this.port = data.port

		this.register(Delegates)
	}

	get self() {
		return this.core.self
	}

	get session() {
		return this.core.self?.session
	}

	public send(packets: Array<Packet<any>>) {
		if (this.dead) {
			throw new Error(Constants.Errors.INACTIVE_CIRCUIT)
		}

		const serialized = packets.map((packet) => this.serializer.convert(packet))

		this.core.send(
			this,
			serialized.map(([buffer]) => buffer),
		)
	}

	/**
	 * @todo Add a retry mechanism, not just a timeout.
	 */
	public sendReliable(packets: Array<Packet<any>>, timeout = 10_000) {
		for (const packet of packets) {
			packet.reliable = true
		}

		const serialized = packets.map((packet) =>
			this.serializer.convert(packet, true),
		)

		const promises = serialized.map(([_, number], index) =>
			this.acknowledger.await(
				packets[index]!.constructor.name,
				number,
				timeout,
			),
		)

		this.core.send(
			this,
			serialized.map(([buffer]) => buffer),
		)

		return Promise.all(promises)
	}

	public receive(buffer: PacketBuffer) {
		if (buffer.reliable) {
			if (this.acknowledger.seen(buffer.sequence)) {
				return
			}

			this.acknowledger.queue(buffer.sequence)
		}

		if (buffer.acks) {
			for (const ack of buffer.acknowledgements()) {
				this.acknowledger.seen(ack)
			}
		}

		const packet = this.deserializer.lookup(buffer)

		if (!packet) {
			return
		}

		if (packet.name in this.delegates && this.delegates[packet.name]?.waiting) {
			// TODO: this is just first come first served, packets are meant to be
			// processed in order...
			this.delegates[packet.name]?.handle(
				this.deserializer.convert(packet, buffer),
			)
		}
	}

	public async handshake() {
		if (!this.dead) {
			throw new Error(Constants.Errors.HANDSHAKE_ACTIVE_CIRCUIT)
		}

		this.dead = false

		assert(this.self?.key, "Avatar key is required")
		assert(this.session, "Session is required")

		await this.sendReliable(
			[
				new UseCircuitCode({
					circuitCode: {
						id: this.self.key,
						code: this.id,
						sessionId: this.session,
					},
				}),
			],
			30_000,
		)

		// TODO: timeout on AgentMovementComplete, currently we'll just hang if we don't get it
		await this.sendReliable([new CompleteAgentMovement({})], 30_000)
	}

	/**
	 * @todo Cannot currently register multiple delegates with the same name!
	 */
	public register(delegates: Record<string, typeof Delegates.Delegate>) {
		for (const Delegate of Object.values(delegates)) {
			if (Delegate !== Delegates.Delegate) {
				this.delegates[Delegate.name.replace(/Delegate$/, "")] = new Delegate(
					this,
				)
			}
		}
	}
}

export default Circuit

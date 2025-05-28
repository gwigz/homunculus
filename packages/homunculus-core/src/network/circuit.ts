import assert from "node:assert"
import type { Client } from "~/client"
import {
	Acknowledger,
	CompleteAgentMovement,
	type Core,
	type Packet,
	type PacketBuffer,
	Serializer,
	UseCircuitCode,
} from "~/network"
import type { Delegate, DelegateContext } from "~/network/delegates"
import * as Delegates from "~/network/delegates"
import { sharedServices } from "~/services"
import { Constants } from "~/utilities"

export interface CircuitOptions {
	id: number
	address: string
	port: number
}

export class Circuit {
	public readonly id: number
	public readonly address: string
	public readonly port: number

	public readonly acknowledger = new Acknowledger(this)
	public readonly serializer = new Serializer(this)

	private delegates: Record<string, Delegate> = {}
	private dead = true

	constructor(
		private readonly client: Client,
		private readonly core: Core,
		data: CircuitOptions,
	) {
		this.id = data.id
		this.address = data.address
		this.port = data.port

		this.register(Delegates)
	}

	get self() {
		return this.client.self
	}

	public send(packets: Array<Packet<any>>) {
		assert.notEqual(this.dead, true, Constants.Errors.INACTIVE_CIRCUIT)

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
		const serialized = packets.map((packet) =>
			this.serializer.convert(packet, true),
		)

		const promises = serialized.map(([_, number], index) =>
			this.acknowledger.awaitServerAcknowledgement(
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
			// ignore packets that we've already seen
			if (!this.acknowledger.isSequenceNew(buffer.sequence)) {
				return
			}

			this.acknowledger.queueAckResponse(buffer.sequence)
		}

		if (buffer.acks) {
			for (const ack of buffer.acknowledgements()) {
				this.acknowledger.handleReceivedAck(ack)
			}
		}

		const packet = sharedServices.deserializer.lookup(buffer)

		if (!packet) {
			return
		}

		if (packet.name in this.delegates && this.delegates[packet.name]?.waiting) {
			this.delegates[packet.name]?.handle(
				sharedServices.deserializer.convert(packet, buffer),
			)
		}
	}

	public async handshake() {
		assert.equal(this.dead, true, Constants.Errors.HANDSHAKE_ACTIVE_CIRCUIT)

		this.dead = false

		assert(this.self.key, "Avatar key is required")
		assert(this.self.sessionId, "Session is required")

		await this.sendReliable([
			new UseCircuitCode({
				circuitCode: {
					id: this.self.key,
					code: this.id,
					sessionId: this.self.sessionId,
				},
			}),
		])

		await this.sendReliable([new CompleteAgentMovement({})])
	}

	/**
	 * @todo Cannot currently register multiple delegates with the same name!
	 */
	public register(delegates: Record<string, typeof Delegates.Delegate>) {
		const context: DelegateContext = {
			client: this.client,
			core: this.core,
			circuit: this,
		}

		for (const Delegate of Object.values(delegates)) {
			if (Delegate !== Delegates.Delegate) {
				// TODO: don't use constructor names for values
				this.delegates[Delegate.name.replace(/Delegate$/, "")] = new Delegate(
					context,
				)
			}
		}
	}
}

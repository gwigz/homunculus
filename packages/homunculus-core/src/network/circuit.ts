import assert from "node:assert"
import type { Client } from "~/client"
import {
	Acknowledger,
	type Core,
	type Packet,
	type PacketBuffer,
	packets,
	Serializer,
} from "~/network"
import { services } from "~/services"
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

	private dead = true

	constructor(
		private readonly client: Client,
		private readonly core: Core,
		data: CircuitOptions,
	) {
		this.id = data.id
		this.address = data.address
		this.port = data.port
	}

	get self() {
		return this.client.self
	}

	get region() {
		// TODO: get the region this circuit connected to
		return this.client.region
	}

	public send(packets: Array<Packet<any>>) {
		assert.notEqual(this.dead, true, Constants.Errors.INACTIVE_CIRCUIT)

		return Promise.all(
			this.core.send(
				this,
				packets.map((packet) => this.serializer.convert(packet)),
			),
		)
	}

	/**
	 * @todo Add a retry mechanism, not just a timeout.
	 */
	public sendReliable(packets: Array<Packet<any>>, timeout = 5_000) {
		assert.notEqual(this.dead, true, Constants.Errors.INACTIVE_CIRCUIT)

		const serialized = packets.map((packet) =>
			this.serializer.convert(packet, true),
		)

		const promises = serialized.map(([_, sequence], index) =>
			this.acknowledger.awaitServerAcknowledgement(
				packets[index]!,
				sequence,
				timeout,
			),
		)

		this.core.send(this, serialized)

		return Promise.all(promises)
	}

	public async receive(buffer: PacketBuffer) {
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

		const packet = services.deserializer.lookup(buffer)

		if (!packet) {
			return
		}

		// TODO: allow for partial deserialization if we don't have any delegates
		await services.delegate.handle(
			services.deserializer.convert(packet, buffer),
			{
				client: this.client,
				core: this.core,
				circuit: this,
				region: this.region,
			},
		)
	}

	public async handshake() {
		assert.equal(this.dead, true, Constants.Errors.HANDSHAKE_ACTIVE_CIRCUIT)

		this.dead = false

		assert(this.self.key, "Avatar key is required")
		assert(this.self.sessionId, "Session is required")

		await this.sendReliable([
			packets.useCircuitCode({
				circuitCode: {
					id: this.self.key,
					code: this.id,
					sessionId: this.self.sessionId,
				},
			}),
		])

		this.client.emit("debug", "Initializing circuit...")

		await this.sendReliable([packets.completeAgentMovement({})])

		this.client.emit("debug", "Completing avatar movement...")
	}
}

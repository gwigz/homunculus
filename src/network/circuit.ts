import Acknowledger from "./acknowledger"
import type Core from "./core"
import Deserializer from "./deserializer"
import Serializer from "./serializer"

import { Constants } from "../utilities"
import * as Delegates from "./delegates"
import type { PacketBuffer } from "./helpers"
import { CompleteAgentMovement, type Packet, UseCircuitCode } from "./packets"

interface ICircuitOptions {
	id: number
	address: string
	port: number
}

class Circuit {
	public readonly id: number
	public readonly address: string
	public readonly port: number

	public readonly acknowledger: Acknowledger
	public readonly deserializer: Deserializer
	public readonly serializer: Serializer

	protected delegates: Record<string, Delegates.Delegate>
	protected dead: boolean

	constructor(
		/** Core instance that instantiated this Circuit. */
		public readonly core: Core,
		data: ICircuitOptions,
	) {
		this.id = data.id
		this.address = data.address
		this.port = data.port
		this.dead = true

		this.acknowledger = new Acknowledger(this)
		this.deserializer = new Deserializer()
		this.serializer = new Serializer(this)
		this.delegates = {}

		this.register(Delegates)
	}

	get agent() {
		return this.core.agent
	}

	get session() {
		return this.core.agent?.session
	}

	public send(...packets: Array<Packet>): Promise<Array<void>> {
		if (this.dead) {
			throw new Error(Constants.Errors.INACTIVE_CIRCUIT)
		}

		return this.core.send(
			this,
			...packets.map((packet) => this.serializer.convert(packet)),
		)
	}

	public receive(buffer: PacketBuffer) {
		if (buffer.reliable) {
			if (this.acknowledger.seen(buffer.sequence)) {
				return
			}

			this.acknowledger.queue(buffer.sequence)
		}

		const packet = this.deserializer.lookup(buffer)

		if (!packet) {
			return
		}

		if (packet.name in this.delegates && this.delegates[packet.name]?.waiting) {
			// TODO: check async
			this.delegates[packet.name]?.handle(
				this.deserializer.convert(packet, buffer),
			)
		}
	}

	public handshake(): Promise<Array<void>> {
		if (!this.dead) {
			throw new Error(Constants.Errors.HANDSHAKE_ACTIVE_CIRCUIT)
		}

		this.dead = false

		return this.send(
			new UseCircuitCode({
				id: this.agent?.id,
				code: this.id,
				session: this.session,
			}),
			new CompleteAgentMovement(),
		)
	}

	public register(delegates: Record<string, typeof Delegates.Delegate>) {
		for (const Delegate of Object.values(delegates)) {
			if (Delegate !== Delegates.Delegate) {
				this.delegates[Delegate.name] = new Delegate(this)
			}
		}
	}
}

export default Circuit
export type { ICircuitOptions }

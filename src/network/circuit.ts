import Acknowledger from "./acknowledger"
import type Core from "./core"
import Deserializer from "./deserializer"
import Serializer from "./serializer"

import * as Delegates from "./delegates"

import type { Agent } from "../structures"
import { Constants } from "../utilities"

import { CompleteAgentMovement, type Packet, UseCircuitCode } from "./packets"

interface ICircuitOptions {
	id: number
	address: string
	port: number
}

class Circuit {
	public readonly core: Core

	public readonly id: number
	public readonly address: string
	public readonly port: number

	public readonly acknowledger: Acknowledger
	public readonly deserializer: Deserializer
	public readonly serializer: Serializer

	protected delegates: any
	protected dead: boolean

	constructor(core: Core, data: ICircuitOptions) {
		/**
		 * Core instance that instantiated this Circuit.
		 *
		 * @name Circuit#core
		 * @type {Circuit}
		 * @readonly
		 */
		Object.defineProperty(this, "core", { value: core })

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

	get agent(): Agent {
		return this.core.agent
	}

	get session(): number {
		return this.core.agent.session
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

	public receive(buffer): void {
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

		if (packet.name in this.delegates && this.delegates[packet.name].waiting) {
			// TODO: check async
			this.delegates[packet.name].handle(
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
				id: this.agent.id,
				code: this.id,
				session: this.session,
			}),
			new CompleteAgentMovement(),
		)
	}

	public register(delegates: any): void {
		for (const Delegate of Object.values(delegates) as Array<
			typeof Delegates.Delegate
		>) {
			if (Delegate !== Delegates.Delegate) {
				this.delegates[Delegate.name] = new Delegate(this)
			}
		}
	}
}

export default Circuit
export type { ICircuitOptions }

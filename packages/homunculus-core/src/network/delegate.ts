import type { Client } from "~/client"
import type {
	Circuit,
	Core,
	DeserializedPacket,
	Packet,
	PacketMetadata,
} from "~/network"

export interface DelegateContext {
	client: Client
	core: Core
	circuit: Circuit
}

export interface DelegateConfig<T extends object> {
	handle: (packet: Packet<T>, context: DelegateContext) => Promise<any> | any
	skip?: (packet: Packet<T>, context: DelegateContext) => boolean
	priority?: number
	metadata: PacketMetadata
}

export class Delegate {
	private delegates: Map<string, DelegateConfig<any>[]> = new Map()

	/**
	 * Register a new packet delegate.
	 */
	register<T extends object>(config: DelegateConfig<T>) {
		const delegates = this.delegates.get(config.metadata.name) || []

		delegates.push(config)
		delegates.sort((a, b) => (b.priority || 0) - (a.priority || 0))

		this.delegates.set(config.metadata.name, delegates)
	}

	/**
	 * Handle a packet by running all registered delegates for its type.
	 */
	async handle(packet: DeserializedPacket, context: DelegateContext) {
		const delegates = this.delegates.get(packet.metadata.name) || []

		for (const delegate of delegates) {
			if (delegate.skip?.(packet, context)) {
				continue
			}

			const promise = delegate.handle(packet, context)

			if (promise instanceof Promise) {
				promise.catch((error) => {
					context.client.emit(
						"error",
						error instanceof Error ? error : new Error(String(error)),
					)
				})
			}
		}
	}
}

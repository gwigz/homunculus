import type { Client } from "~/client"
import type { Circuit, Core, Packet, PacketMetadata } from "~/network"
import type { Region } from "~/structures"

export interface DelegateContext {
	client: Client
	core: Core
	circuit: Circuit
	region: Region
}

export interface DelegateConfig<T extends object> {
	handle: (packet: Packet<T>, context: DelegateContext) => Promise<any> | any
	skip?: (context: DelegateContext) => boolean
	priority?: number
	metadata: PacketMetadata
}

export class Delegate {
	private delegates: Map<string, DelegateConfig<any>[]> = new Map()

	/**
	 * Register a new packet delegate.
	 */
	public register<T extends object>(config: DelegateConfig<T>) {
		const delegates = this.delegates.get(config.metadata.name) || []

		delegates.push(config)
		delegates.sort((a, b) => (b.priority || 0) - (a.priority || 0))

		this.delegates.set(config.metadata.name, delegates)
	}

	/**
	 * Gets all delegates that are ready to handle a packet.
	 */
	public get(name: string, context: DelegateContext) {
		const delegates = this.delegates.get(name) || []

		return delegates.filter((delegate) => !delegate.skip?.(context))
	}
}

import type { Client } from "~/client"
import type { Circuit, Core } from "~/network"

export interface DelegateContext {
	client: Client
	core: Core
	circuit: Circuit
}

export class Delegate {
	constructor(private readonly context: DelegateContext) {}

	get circuit() {
		return this.context.circuit
	}

	get core() {
		return this.context.core
	}

	get client() {
		return this.context.client
	}

	/**
	 * Toggle for avoiding decoding packets we don't care about, for example
	 * ChatFromSimulator will return `false` if no listen events are bound to
	 * the clients nearby helper.
	 *
	 * @returns True if we want to receive packets, defaulted to true
	 */
	get waiting() {
		return true
	}

	/**
	 * Handler received and parsed Packet objects.
	 */
	handle(_packet: any): Promise<void> | void {}
}

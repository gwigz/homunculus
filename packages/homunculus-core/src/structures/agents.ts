import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import type { Agent } from "./agent"

export interface AgentsEvents {
	set: [agent: Agent]
	delete: [agent: Agent]
}

export class Agents extends AsyncEventEmitter<AgentsEvents> {
	private agents = new Map<string, Agent>()

	public has(key: string) {
		return this.agents.has(key)
	}

	public get(key: string) {
		return this.agents.get(key)
	}

	public set(key: string, agent: Agent) {
		this.agents.set(key, agent)
		this.emit("set", agent)

		return this
	}

	public delete(key: string) {
		const agent = this.get(key)

		if (agent) {
			this.emit("delete", agent)
		}

		return this.agents.delete(key)
	}

	public entries() {
		return this.agents.entries()
	}

	public values() {
		return this.agents.values()
	}

	public keys() {
		return this.agents.keys()
	}

	public get size() {
		return this.agents.size
	}
}

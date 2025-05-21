import assert from "node:assert"
import type { Client } from ".."
import { ImprovedInstantMessage } from "../network/packets"
import { UUID, Vector3 } from "../network/types"
import type Entity from "./entity"

class Agent {
	public firstname?: string
	public lastname?: string
	public entity: Entity

	constructor(
		public readonly client: Client,
		entity: Entity,
	) {
		this.entity = entity
	}

	get id(): number {
		return this.entity.id
	}

	get key(): string {
		return this.entity.key
	}

	get name(): string {
		return `${this.firstname} ${this.lastname}`.trim()
	}

	get distance(): number {
		return this.client.self?.position && this.entity.position
			? Vector3.distance(this.client.self.position, this.entity.position)
			: -1
	}

	/**
	 * Sends an instant message to the agent.
	 *
	 * @param message The message to send.
	 */
	public message(message: string) {
		assert(this.client.self, "Agent is not ready")

		return this.client.send(
			new ImprovedInstantMessage({
				id: this.client.self.session,
				dialog: 0,
				timestamp: 0,
				fromGroup: false,
				fromAgentName: this.client.self.name,
				message: `${message}\x00`,
				toAgent: this.key,
				offline: 0,
				parentEstate: 0,
				region: UUID.zero,
				position: Vector3.zero,
				binaryBucket: null,
			}),
		)
	}
}

export default Agent

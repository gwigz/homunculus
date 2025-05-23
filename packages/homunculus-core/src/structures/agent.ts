import assert from "node:assert"
import type { Client } from ".."
import { type AvatarCache, cache } from "../cache"
import { AcknowledgeTimeoutError } from "../network/acknowledger"
import { ImprovedInstantMessage, UUIDNameRequest } from "../network/packets"
import { UUID, Vector3 } from "../network/types"
import type Entity from "./entity"

const ONE_HOUR = 1000 * 60 * 60

class Agent {
	public firstName?: string
	public lastName?: string
	public entity: Entity

	constructor(
		public readonly client: Client,
		entity: Entity,
	) {
		this.entity = entity

		this.init()
	}

	get id() {
		return this.entity.id
	}

	get key() {
		return this.entity.key
	}

	get name() {
		return this.firstName
			? `${this.firstName} ${!this.lastName || this.lastName === "Resident" ? "" : this.lastName}`.trimEnd()
			: undefined
	}

	get distance(): number {
		return this.client.self?.position && this.entity.position
			? Vector3.distance(this.client.self.position, this.entity.position)
			: -1
	}

	/**
	 * Attempts to fetch avatar details (such as name, etc.) from cache, or server.
	 */
	public async init() {
		try {
			const avatar = await cache.get<AvatarCache>(`avatar:${this.key}`)

			if (avatar) {
				this.firstName = avatar.firstName
				this.lastName = avatar.lastName
			}

			if (!avatar || avatar.lastUpdated < Date.now() - ONE_HOUR) {
				const request = new UUIDNameRequest({
					uuidNameBlock: [{ id: this.key }],
				})

				await this.client.sendReliable([request])
			}
		} catch (error) {
			if (error instanceof AcknowledgeTimeoutError) {
				this.client.emit(
					"warning",
					`Timed out trying to get name for agent "${this.key}".`,
				)
			} else {
				this.client.emit("error", error as Error)
			}
		}
	}

	/**
	 * Attempts to update avatar details (such as name, etc.) cache.
	 */
	public async update(
		profile: Partial<{ firstName: string; lastName: string }>,
	) {
		if (
			profile.firstName &&
			(this.firstName !== profile.firstName ||
				this.lastName !== profile.lastName)
		) {
			this.firstName = profile.firstName
			this.lastName = profile.lastName

			try {
				await cache.set<AvatarCache>(`avatar:${this.key}`, {
					firstName: profile.firstName,
					lastName: profile.lastName,
					lastUpdated: Date.now(),
				})
			} catch (error) {
				this.client.emit("error", error as Error)
			}
		}
	}

	/**
	 * Sends an instant message to the agent.
	 *
	 * @param message The message to send.
	 */
	public message(message: string) {
		assert(this.client.self, "Agent is not ready")

		return this.client.send([
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
		])
	}
}

export default Agent

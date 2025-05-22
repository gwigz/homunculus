import assert from "node:assert"
import { eq } from "drizzle-orm"
import type { Client } from ".."
import { db, schema } from "../database"
import { ImprovedInstantMessage, UUIDNameRequest } from "../network/packets"
import { UUID, Vector3 } from "../network/types"
import type Entity from "./entity"

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
			const [cache] = await db
				.select()
				.from(schema.avatars)
				.where(eq(schema.avatars.key, this.key))
				.execute()

			if (cache?.firstName && cache?.lastName) {
				this.firstName = cache.firstName
				this.lastName = cache.lastName
			}

			if (!cache || cache.lastUpdated < Date.now() - 1000 * 60 * 60) {
				const request = new UUIDNameRequest({
					uuidNameBlock: [{ id: this.key }],
				})

				request.reliable = true

				this.client.send(request)
			}
		} catch (error) {
			this.client.emit("error", error as Error)
		}
	}

	/**
	 * Attempts to update avatar details (such as name, etc.) cache.
	 */
	public async update(
		profile: Partial<{ firstName: string; lastName: string }>,
	) {
		if (
			this.firstName !== profile.firstName ||
			this.lastName !== profile.lastName
		) {
			this.firstName = profile.firstName
			this.lastName = profile.lastName

			try {
				const cache = { firstName: this.firstName, lastName: this.lastName }

				await db
					.insert(schema.avatars)
					.values({ key: this.key, ...cache })
					.onConflictDoUpdate({ target: [schema.avatars.key], set: cache })
					.execute()
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

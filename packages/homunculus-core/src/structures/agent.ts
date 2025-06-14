import { type AvatarCache, cache } from "~/cache"
import type { Client } from "~/client"
import { AcknowledgeTimeoutError, packets, Vector3 } from "~/network"
import type { Entity } from "~/structures"

const ONE_HOUR = 1000 * 60 * 60

export class Agent {
	public firstName?: string
	public lastName?: string
	public entity?: Entity

	/**
	 * The coarse location of the agent, used by the viewer for minimap.
	 *
	 * It is not accurate, should only be used if we have no entity, which
	 * also would suggest that the agent is not nearby.
	 */
	public coarseLocation?: Vector3

	/**
	 * @internal
	 */
	constructor(
		private readonly client: Client,
		public readonly key: string,
		entity?: Entity,
	) {
		this.entity = entity

		this.init()
	}

	get id() {
		return this.entity?.id
	}

	get name() {
		return this.firstName
			? `${this.firstName} ${!this.lastName || this.lastName === "Resident" ? "" : this.lastName}`.trimEnd()
			: undefined
	}

	get distance(): number {
		return this.entity?.position
			? Vector3.distance(this.client.self.position, this.entity.position)
			: Number.MAX_SAFE_INTEGER
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
				// TODO: add a queue for requesting names, so we can bulk them
				await this.client.sendReliable([
					packets.uuidNameRequest({ uuidNameBlock: [{ id: this.key }] }),
				])
			}
		} catch (error) {
			if (error instanceof AcknowledgeTimeoutError) {
				this.client.emit(
					"warn",
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
		return this.client.instantMessages.send(this.key, message)
	}
}

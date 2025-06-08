import assert from "node:assert"
import { randomUUID } from "node:crypto"
import { cache, type RegionCache } from "~/cache"
import type { Client } from "~/client"
import { AcknowledgeTimeoutError, packets, UUID, type Vector3 } from "~/network"
import { Agent, Agents, Capabilities, Entities } from "~/structures"

const ONE_DAY = 1000 * 60 * 60 * 24

export class Region {
	public handle: bigint
	public name?: string
	public agents = new Agents()
	public objects = new Entities()
	public capabilities?: Capabilities

	/**
	 * Creates a new region instance.
	 *
	 * @param client Client instance.
	 * @param data Region data.
	 * @param skipInitialUpdate Used for initial login, may be removed in the future.
	 * @internal
	 */
	constructor(
		private readonly client: Client,
		data: { handle: bigint; seedCapability?: string },
		skipInitialUpdate = false,
	) {
		this.handle = data.handle

		if (data.seedCapability) {
			this.capabilities = new Capabilities(client, data.seedCapability)
		}

		if (!skipInitialUpdate) {
			this.init()
		}
	}

	/**
	 * Attempts to fetch map details from cache, or server.
	 *
	 * @internal
	 */
	public async init() {
		try {
			const region = await cache.get<RegionCache>(`region:${this.handle}`)

			if (region) {
				this.name = region.name
			}

			if (!region || region.lastUpdated < Date.now() - ONE_DAY) {
				const x = Math.floor(Number(this.handle >> 32n) / 256)
				const y = Math.floor(Number(this.handle & 0xffffffffn) / 256)

				this.client.sendReliable([
					packets.mapBlockRequest({
						positionData: { minX: x, minY: y, maxX: x, maxY: y },
					}),
				])
			}
		} catch (error) {
			if (error instanceof AcknowledgeTimeoutError) {
				this.client.emit(
					"warn",
					`Timed out trying to get name for region "${this.handle}".`,
				)
			} else {
				this.client.emit("error", error as Error)
			}
		}
	}

	/**
	 * Attempts to update avatar details (such as name, etc.) cache.
	 *
	 * @todo Rename this
	 * @internal
	 */
	public async update(data: Partial<{ name: string }>) {
		if (data.name && this.name !== data.name) {
			this.name = data.name

			try {
				await cache.set<RegionCache>(`region:${this.handle}`, {
					name: data.name,
					lastUpdated: Date.now(),
				})
			} catch (error) {
				this.client.emit("error", error as Error)
			}
		}
	}

	// public async getParcelByPosition(position: Vector3) {
	// 	return this.getParcelByCoordinates(position.x, position.y)
	// }

	// public async getParcelByCoordinates(x: number, y: number) {
	// 	// TODO: implement this
	// }

	/**
	 * Handles coarse location updates for agents in the region.
	 *
	 * @param agents Map of agent keys and their coarse locations.
	 * @internal
	 */
	public handleCoarseLocationUpdates(agents: Map<string, Vector3>) {
		for (const agent of this.agents.values()) {
			// remove agents have left the region
			if (!agents.has(agent.key)) {
				this.agents.delete(agent.key)
			}
		}

		for (const [key, coarseLocation] of agents) {
			const exists = this.agents.has(key)
			const agent = exists ? this.agents.get(key)! : new Agent(this.client, key)

			agent.coarseLocation = coarseLocation

			if (!exists) {
				this.agents.set(key, agent)
			}
		}
	}

	/**
	 * Sends an estate message to the region.
	 *
	 * @param message Message to send.
	 */
	public async sendEstateMessage(message: string) {
		assert.ok(
			this.client.self.isEstateManager,
			"Cannot send estate message if not estate manager",
		)

		await this.client.send([
			packets.estateOwnerMessage({
				agentData: { transactionId: UUID.zero },
				methodData: { method: "simulatormessage", invoice: randomUUID() },
				paramList: [
					{ parameter: this.client.self.name },
					{ parameter: message },
				],
			}),
		])
	}
}

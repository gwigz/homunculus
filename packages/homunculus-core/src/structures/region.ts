import assert from "node:assert"
import { randomUUID } from "node:crypto"
import { type Client, UUID } from ".."
import { cache, type RegionCache } from "../cache"
import { AcknowledgeTimeoutError } from "../network/acknowledger"
import { EstateOwnerMessage, MapBlockRequest } from "../network/packets"
import Agents from "./agents"
import Entities from "./entities"

const ONE_DAY = 1000 * 60 * 60 * 24

class Region {
	public handle: bigint
	public name?: string
	public agents = new Agents()
	public objects = new Entities()

	constructor(
		/** The Client that instantiated this Region. */
		public readonly client: Client,
		data: { handle: bigint },
	) {
		this.handle = data.handle

		this.init()
	}

	/**
	 * Attempts to fetch map details from cache, or server.
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

				const request = new MapBlockRequest({
					positionData: { minX: x, minY: y, maxX: x, maxY: y },
				})

				this.client.sendReliable([request])
			}
		} catch (error) {
			if (error instanceof AcknowledgeTimeoutError) {
				this.client.emit(
					"warning",
					`Timed out trying to get name for region "${this.handle}".`,
				)
			} else {
				this.client.emit("error", error as Error)
			}
		}
	}

	/**
	 * Attempts to update avatar details (such as name, etc.) cache.
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

	public async sendEstateMessage(message: string) {
		assert(this.client.self?.name, "Cannot send estate message without a name")

		assert(
			this.client.self?.isEstateManager,
			"Cannot send estate message without being an estate manager",
		)

		await this.client.send([
			new EstateOwnerMessage({
				agentData: { transactionId: UUID.zero },
				methodData: {
					method: "simulatormessage",
					invoice: randomUUID(),
				},
				paramList: [
					{ parameter: this.client.self.name },
					{ parameter: message },
				],
			}),
		])
	}
}

export default Region

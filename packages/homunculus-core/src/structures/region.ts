import { eq } from "drizzle-orm"
import type { Client } from ".."
import { db, schema } from "../database"
import { MapBlockRequest } from "../network/packets"
import Agents from "./agents"
import Entities from "./entities"

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
			const [cache] = await db
				.select()
				.from(schema.regions)
				.where(eq(schema.regions.handle, this.handle.toString()))
				.execute()

			if (cache?.name) {
				this.name = cache.name
			}

			if (!cache || cache.lastUpdated < Date.now() - 1000 * 60 * 60 * 24) {
				const x = Math.floor(Number(this.handle >> 32n) / 256)
				const y = Math.floor(Number(this.handle & 0xffffffffn) / 256)

				const request = new MapBlockRequest({
					positionData: { minX: x, minY: y, maxX: x, maxY: y },
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
	public async update(data: Partial<{ name: string }>) {
		if (this.name !== data.name) {
			this.name = data.name

			try {
				const cache = { name: data.name }

				await db
					.insert(schema.regions)
					.values({ handle: this.handle.toString(), ...cache })
					.onConflictDoUpdate({ target: [schema.regions.handle], set: cache })
					.execute()
			} catch (error) {
				this.client.emit("error", error as Error)
			}
		}
	}
}

export default Region

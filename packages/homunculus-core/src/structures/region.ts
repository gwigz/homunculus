import type { Client } from ".."
import type Agent from "./agent"
import Entities from "./entities"
import type Parcel from "./parcel"

interface IRegionOptions {
	handle: number
}

class Region {
	public handle: number
	public agents: Map<string, Agent>
	public objects: Entities
	public parcels: Map<string, Parcel>

	/**
	 * @param client The Client that instantiated this Region.
	 * @param data Handle of the region.
	 */
	constructor(
		public readonly client: Client,
		data: IRegionOptions,
	) {
		this.handle = data.handle
		this.agents = new Map()
		this.objects = new Entities()
		this.parcels = new Map()
	}
}

export default Region

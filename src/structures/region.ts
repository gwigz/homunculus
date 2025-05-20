import type { Client } from ".."
import { Collection } from "../utilities"

import type Agent from "./agent"
import Entities from "./entities"
import type Parcel from "./parcel"

interface IRegionOptions {
	handle: number
}

class Region {
	public handle: number
	public agents: Collection<string, Agent>
	public objects: Entities
	public parcels: Collection<string, Parcel>

	/**
	 * @param client The Client that instantiated this Region.
	 * @param data Handle of the region.
	 */
	constructor(
		public readonly client: Client,
		data: IRegionOptions,
	) {
		this.handle = data.handle
		this.agents = new Collection()
		this.objects = new Entities()
		this.parcels = new Collection()
	}
}

export default Region

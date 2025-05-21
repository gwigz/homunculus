import type { Client } from ".."
import Agents from "./agents"
import Entities from "./entities"

class Region {
	public handle: number
	public agents = new Agents()
	public objects = new Entities()

	constructor(
		/** The Client that instantiated this Region. */
		public readonly client: Client,
		data: { handle: number },
	) {
		this.handle = data.handle
	}
}

export default Region

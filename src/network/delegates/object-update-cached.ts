import { RequestMultipleObjects } from "../packets"
import Delegate from "./delegate"

class ObjectUpdateCached extends Delegate {
	public handle(packet): void {
		const uncached = packet.data.objectData.map((data) => ({
			id: data.id,
			cacheMissType: 0,
		}))

		this.circuit.send(
			new RequestMultipleObjects({
				objectData: uncached,
			}),
		)
	}
}

export default ObjectUpdateCached

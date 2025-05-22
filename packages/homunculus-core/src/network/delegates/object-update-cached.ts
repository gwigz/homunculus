import {
	type ObjectUpdateCached as ObjectUpdateCachedPacket,
	RequestMultipleObjects,
} from "../packets"
import Delegate from "./delegate"

class ObjectUpdateCached extends Delegate {
	public handle(packet: ObjectUpdateCachedPacket) {
		const uncached = packet.data.objectData.map((data: any) => ({
			id: data.id,
			cacheMissType: 0,
		}))

		this.circuit.send([new RequestMultipleObjects({ objectData: uncached })])
	}
}

export default ObjectUpdateCached

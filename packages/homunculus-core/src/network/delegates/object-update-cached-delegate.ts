import {
	type ObjectUpdateCached,
	RequestMultipleObjects,
} from "~/network/packets"
import { Delegate } from "./delegate"

class ObjectUpdateCachedDelegate extends Delegate {
	public override handle(packet: ObjectUpdateCached) {
		const uncached = packet.data.objectData!.map((data: any) => ({
			id: data.id,
			cacheMissType: 0,
		}))

		this.circuit.send([new RequestMultipleObjects({ objectData: uncached })])
	}
}

export default ObjectUpdateCachedDelegate

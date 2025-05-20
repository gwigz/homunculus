import type { KillObject as KillObjectPacket } from "../packets"
import Delegate from "./delegate"

class KillObject extends Delegate {
	public handle(packet: KillObjectPacket) {
		for (const region of this.client.regions.values()) {
			for (const { id } of packet.data.objectData) {
				region.objects.delete(id)
			}
		}
	}
}

export default KillObject

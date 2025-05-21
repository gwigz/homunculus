import type { KillObject as KillObjectPacket } from "../packets"
import Delegate from "./delegate"

class KillObject extends Delegate {
	public handle(packet: KillObjectPacket) {
		for (const region of this.client.regions.values()) {
			for (const { id } of packet.data.objectData) {
				if (!region.objects.has(id)) {
					continue
				}

				const object = region.objects.get(id)!

				object.dead = true

				for (const child of object.children) {
					if (region.objects.has(child)) {
						region.objects.get(child)!.dead = true
						region.objects.delete(child)
					}
				}

				if (region.agents.has(object.key)) {
					region.agents.delete(object.key)
				}

				region.objects.delete(id)
			}
		}
	}
}

export default KillObject

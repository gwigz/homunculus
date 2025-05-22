import type { UUIDNameReply as UUIDNameReplyPacket } from "../packets"
import Delegate from "./delegate"

class UUIDNameReply extends Delegate {
	public handle(packet: UUIDNameReplyPacket) {
		for (const data of packet.data.uuidNameBlock) {
			this.findAgent(data.id)?.update({
				firstName: data.firstName.toString().slice(0, -1),
				lastName: data.lastName.toString().slice(0, -1),
			})
		}
	}

	public findAgent(id: string) {
		for (const region of this.client.regions.values()) {
			return region.agents.get(id)
		}
	}
}

export default UUIDNameReply

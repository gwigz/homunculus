import type { UUIDNameReply } from "~/network/packets"
import Delegate from "./delegate"

class UUIDNameReplyDelegate extends Delegate {
	public override handle(packet: UUIDNameReply) {
		for (const data of packet.data.uuidNameBlock!) {
			this.findAgent(data.id)?.update({
				firstName: data.firstName.toString("utf8").slice(0, -1),
				lastName: data.lastName.toString("utf8").slice(0, -1),
			})
		}
	}

	public findAgent(id: string) {
		for (const region of this.client.regions.values()) {
			return region.agents.get(id)
		}
	}
}

export default UUIDNameReplyDelegate

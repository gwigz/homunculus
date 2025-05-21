import type { HealthMessage as HealthMessagePacket } from "../packets"
import Delegate from "./delegate"

class HealthMessage extends Delegate {
	public handle(packet: HealthMessagePacket) {
		const data = packet.data.healthData[0]
		const self = this.client.self

		if (self) {
			self.health = data.health
		}
	}
}

export default HealthMessage

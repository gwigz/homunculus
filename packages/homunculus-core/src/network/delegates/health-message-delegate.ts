import type { HealthMessage } from "../packets"
import Delegate from "./delegate"

class HealthMessageDelegate extends Delegate {
	public override handle(packet: HealthMessage) {
		const data = packet.data.healthData[0]
		const self = this.client.self

		if (self) {
			self.health = data.health
		}
	}
}

export default HealthMessageDelegate

import type { HealthMessage } from "~/network/packets"
import Delegate from "./delegate"

class HealthMessageDelegate extends Delegate {
	public override handle(packet: HealthMessage) {
		const data = packet.data.healthData!
		const self = this.client.self

		if (self) {
			self.health = data.health
		}
	}
}

export default HealthMessageDelegate

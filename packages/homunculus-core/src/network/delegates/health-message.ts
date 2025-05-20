import type { HealthMessage as HealthMessagePacket } from "../packets"
import Delegate from "./delegate"

class HealthMessage extends Delegate {
	public handle(packet: HealthMessagePacket) {
		const data = packet.data.healthData[0]
		const agent = this.client.agent

		if (agent) {
			agent.health = data.health
		}
	}
}

export default HealthMessage

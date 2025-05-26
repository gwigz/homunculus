import type { AgentDataUpdate } from "../packets"
import Delegate from "./delegate"

class AgentDataUpdateDelegate extends Delegate {
	public override handle(packet: AgentDataUpdate) {
		const data = packet.data.agentData!
		const self = this.client.self

		if (self) {
			self.firstName = data.firstName.toString("utf8").slice(0, -1)
			self.lastName = data.lastName.toString("utf8").slice(0, -1)
		}

		/*
      agent.group = {
        key: data.activeGroup,
        name: data.groupName,
        title: data.groupTitle,
        permissions: data.groupPowers
      }
    */
	}
}

export default AgentDataUpdateDelegate

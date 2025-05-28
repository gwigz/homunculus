import { packets } from "~/network"

packets.createAgentDataUpdateDelegate({
	handle: (packet, context) => {
		const self = context.client.self

		if (self) {
			self.firstName = packet.data
				.agentData!.firstName.toString("utf8")
				.slice(0, -1)

			self.lastName = packet.data
				.agentData!.lastName.toString("utf8")
				.slice(0, -1)
		}

		/*
      agent.group = {
        key: data.activeGroup,
        name: data.groupName,
        title: data.groupTitle,
        permissions: data.groupPowers
      }
    */
	},
})

import { packets } from "~/network"

packets.createUUIDNameReplyDelegate({
	handle: (packet, context) => {
		for (const nameBlock of packet.data.uuidNameBlock!) {
			// TODO: maybe agents should be defined in client, and not in region?
			const agent = context.client.region.agents.get(nameBlock.id)

			if (!agent) {
				continue
			}

			agent.update({
				firstName: nameBlock.firstName.toString("utf8").slice(0, -1),
				lastName: nameBlock.lastName.toString("utf8").slice(0, -1),
			})
		}
	},
})

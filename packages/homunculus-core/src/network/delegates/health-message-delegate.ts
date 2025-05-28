import { packets } from "~/network"

packets.createHealthMessageDelegate({
	handle: (packet, context) => {
		const self = context.client.self

		if (self) {
			self.health = packet.data.healthData!.health
		}
	},
})

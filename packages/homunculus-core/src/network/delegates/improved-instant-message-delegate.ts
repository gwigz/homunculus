import { packets } from "~/network"
import { InstantMessageTypes } from "~/utilities/constants"

packets.createImprovedInstantMessageDelegate({
	handle: (packet, context) => {
		const data = packet.data.messageBlock!

		switch (data.dialog) {
			case InstantMessageTypes.NORMAL:
			case InstantMessageTypes.DO_NOT_DISTURB_AUTO_RESPONSE:
			case InstantMessageTypes.TYPING_START:
			case InstantMessageTypes.TYPING_STOP:
				return context.client.instantMessages.emit("message", {
					id: data.id,
					timestamp: data.timestamp,
					type: data.dialog,
					source: packet.data.agentData!.agentId!,
					name: data.fromAgentName.toString("utf8").slice(0, -1),
					message: data.message.toString("utf8").slice(0, -1),
					...(data.offline === 1 ? { isOfflineMessage: true } : {}),
				})

			default:
				break
		}
	},
})

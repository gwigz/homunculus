import { packets } from "~/network"

packets.createChatFromSimulatorDelegate({
	handle: (packet, context) => {
		const chatData = packet.data.chatData!

		context.client.nearby.emit("chat", {
			fromName: chatData.fromName.toString("utf8").slice(0, -1),
			source: chatData.sourceId,
			owner: chatData.ownerId,
			sourceType: chatData.sourceType,
			chatType: chatData.chatType,
			audible: chatData.audible,
			position: chatData.position,
			message: chatData.message.toString("utf8").slice(0, -1),
		})
	},
	skip: (_, context) => !context.client.nearby.listenerCount("chat"),
})

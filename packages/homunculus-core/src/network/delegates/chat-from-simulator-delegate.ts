import type { ChatFromSimulatorData } from "~/network/packets"
import type { NearbyChatMessage } from "~/structures/nearby"
import { Delegate } from "./delegate"

class ChatFromSimulatorDelegate extends Delegate {
	public override handle(packet: { data: ChatFromSimulatorData }) {
		const data = packet.data.chatData!

		const chat = {
			fromName: data.fromName.toString("utf8").slice(0, -1),
			source: data.sourceId,
			owner: data.ownerId,
			sourceType: data.sourceType,
			chatType: data.chatType,
			audible: data.audible,
			position: data.position,
			message: data.message.toString("utf8").slice(0, -1),
		} satisfies NearbyChatMessage

		// if (data.source === Constants.ChatSources.OBJECT) {
		// 	chatter.owner = data.owner
		// }

		this.client.nearby.emit("chat", chat)
	}

	override get waiting() {
		return !!this.client.nearby.listenerCount("chat")
	}
}

export default ChatFromSimulatorDelegate

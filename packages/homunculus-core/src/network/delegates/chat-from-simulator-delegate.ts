import type { NearbyChatMessage } from "../../structures/nearby"
import type { ChatFromSimulator } from "../packets"
import { UUID } from "../types"
import Delegate from "./delegate"

class ChatFromSimulatorDelegate extends Delegate {
	public override handle(packet: ChatFromSimulator) {
		for (const data of packet.data.chatData) {
			const chat = {
				fromName: data.fromName.toString().slice(0, -1),
				source: data.source ?? UUID.zero,
				owner: data.source ?? UUID.zero,
				sourceType: data.sourceType,
				chatType: data.chatType,
				audible: data.audible,
				position: data.position,
				message: data.message.toString().slice(0, -1),
			} satisfies NearbyChatMessage

			// if (data.source === Constants.ChatSources.OBJECT) {
			// 	chatter.owner = data.owner
			// }

			this.client.nearby.emit("chat", chat)
		}
	}

	override get waiting() {
		return !!this.client.nearby.listenerCount("chat")
	}
}

export default ChatFromSimulatorDelegate

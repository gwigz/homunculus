import type { NearbyChatter } from "../../structures/nearby"
import { Constants } from "../../utilities"
import type { ChatFromSimulator as ChatFromSimulatorPacket } from "../packets"
import { UUID } from "../types"
import Delegate from "./delegate"

class ChatFromSimulator extends Delegate {
	public handle(packet: ChatFromSimulatorPacket) {
		for (const data of packet.data.chatData) {
			const chatter = {
				key: data.source,
				name: data.fromName.toString().slice(0, -1),
				type: data.sourceType,
				owner: UUID.zero,
				position: data.position,
			} satisfies NearbyChatter

			if (data.source === Constants.ChatSources.OBJECT) {
				chatter.owner = data.owner
			}

			this.client.nearby.emit(
				"chat",
				chatter,
				data.message.toString().slice(0, -1),
			)
		}
	}

	get waiting() {
		return !!this.client.nearby.listenerCount("chat")
	}
}

export default ChatFromSimulator

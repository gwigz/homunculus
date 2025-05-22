import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import type { Client } from ".."
import { ChatFromViewer } from "../network/packets"
import { Constants } from "../utilities"

export interface NearbyChatMessage {
	fromName: string
	source: string
	owner: string
	sourceType: number
	chatType: number
	audible: number
	position: [number, number, number]
	message: string
}

export interface NearbyEvents {
	chat: [chat: NearbyChatMessage]
}

class Nearby extends AsyncEventEmitter<NearbyEvents> {
	constructor(public readonly client: Client) {
		super()
	}

	// get agents() {
	// 	return this.client.regions.get(this.client.self?.offset)?.agents
	// }

	public whisper(message: string, channel = 0) {
		this.message(message, channel, Constants.ChatTypes.WHISPER)
	}

	public say(message: string, channel = 0) {
		this.message(message, channel, Constants.ChatTypes.NORMAL)
	}

	public shout(message: string, channel = 0) {
		this.message(message, channel, Constants.ChatTypes.SHOUT)
	}

	public message(
		message: string,
		channel = 0,
		type: number = Constants.ChatTypes.NORMAL,
	) {
		return this.client.send([
			new ChatFromViewer({
				chatData: { channel, type, message: `${message}\x00` },
			}),
		])
	}
}

export default Nearby

import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import type { Client } from ".."
import { ChatFromViewer } from "../network/packets"
import { Constants } from "../utilities"

export interface NearbyChatter {
	key: string
	name: string
	type: number
	owner: string
	position: [number, number, number]
}

export interface NearbyEvents {
	chat: [chatter: NearbyChatter, message: string]
}

class Nearby extends AsyncEventEmitter<NearbyEvents> {
	constructor(public readonly client: Client) {
		super()
	}

	// get agents(): Collection<string, Agent> {
	// 	return this.client.region.agents
	// }

	public whisper(message: string, channel = 0): Promise<Array<void>> {
		return this.message(message, channel, Constants.ChatTypes.WHISPER)
	}

	public say(message: string, channel = 0): Promise<Array<void>> {
		return this.message(message, channel, Constants.ChatTypes.NORMAL)
	}

	public shout(message: string, channel = 0): Promise<Array<void>> {
		return this.message(message, channel, Constants.ChatTypes.SHOUT)
	}

	public message(
		message: string,
		channel = 0,
		type = Constants.ChatTypes.NORMAL,
	): Promise<Array<void>> {
		return this.client.send(
			new ChatFromViewer({
				chatData: { channel, type, message: `${message}\x00` },
			}),
		)
	}
}

export default Nearby

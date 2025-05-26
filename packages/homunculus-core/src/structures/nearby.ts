import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import { type Agent, type Client, Vector3 } from ".."
import { ChatFromViewer, EjectUser, FreezeUser } from "../network/packets"
import { Constants } from "../utilities"

export interface NearbyChatMessage {
	fromName: string
	source: string
	owner: string
	sourceType: number
	chatType: number
	audible: number
	position: Vector3
	message: string
}

export interface NearbyEvents {
	chat: [chat: NearbyChatMessage]
}

class Nearby extends AsyncEventEmitter<NearbyEvents> {
	private typingTimeout?: NodeJS.Timeout

	constructor(public readonly client: Client) {
		super()
	}

	/**
	 * Agents within 20 meters of the client's position.
	 */
	get agents() {
		if (!this.client.self?.position) {
			return [] as Agent[]
		}

		return Array.from(this.client.region?.agents.values() ?? []).filter(
			(agent) =>
				agent.entity.key !== this.client.self!.key &&
				agent.entity.position &&
				Vector3.distance(this.client.self!.position, agent.entity.position) <=
					20,
		)
	}

	/**
	 * Starts typing in the current region.
	 *
	 * @param timeout Optional, milliseconds to wait before stop typing is called.
	 */
	public async startTyping(timeout?: number) {
		await this.message("", 0, Constants.ChatTypes.TYPING)

		clearTimeout(this.typingTimeout)

		if (timeout) {
			this.typingTimeout = setTimeout(() => this.stopTyping(), timeout)
		}
	}

	/**
	 * Stops typing in the current region.
	 */
	public stopTyping() {
		clearTimeout(this.typingTimeout)

		return this.message("", 0, Constants.ChatTypes.NORMAL)
	}

	/**
	 * Sends a whisper to the specified channel.
	 *
	 * @param message The message to send.
	 * @param channel Optional, channel to send the message to.
	 */
	public whisper(message: string, channel = 0) {
		return this.message(message, channel, Constants.ChatTypes.WHISPER)
	}

	/**
	 * Sends a normal message to the specified channel.
	 *
	 * @param message The message to send.
	 * @param channel Optional, channel to send the message to.
	 */
	public say(message: string, channel = 0) {
		return this.message(message, channel, Constants.ChatTypes.NORMAL)
	}

	/**
	 * Sends a shout message to the specified channel.
	 *
	 * @param message The message to send.
	 * @param channel Optional, channel to send the message to.
	 */
	public shout(message: string, channel = 0) {
		return this.message(message, channel, Constants.ChatTypes.SHOUT)
	}

	/**
	 * Sends a message to the specified channel.
	 *
	 * @param message The message to send.
	 * @param channel Optional, channel to send the message to.
	 * @param type Optional, type of message to send.
	 */
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

	/**
	 * Ejects the specified agent from the current region.
	 *
	 * @param key The key of the agent to eject.
	 * @param ban Optional, whether to ban the agent from the region.
	 */
	public eject(key: string, ban = false) {
		return this.client.send([
			new EjectUser({ data: { target: key, flags: ban ? 1 : 0 } }),
		])
	}

	/**
	 * Freezes the specified agent in the current region.
	 *
	 * @param key The key of the agent to freeze.
	 */
	public freeze(key: string) {
		return this.client.send([
			new FreezeUser({ data: { target: key, flags: 0 } }),
		])
	}

	/**
	 * Unfreezes the specified agent in the current region.
	 *
	 * @param key The key of the agent to unfreeze.
	 */
	public unfreeze(key: string) {
		return this.client.send([
			new FreezeUser({ data: { target: key, flags: 1 } }),
		])
	}
}

export default Nearby

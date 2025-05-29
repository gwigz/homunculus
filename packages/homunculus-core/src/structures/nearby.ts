import { Buffer } from "node:buffer"
import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import type { Client } from "~/client"
import { packets, UUID, Vector3 } from "~/network"
import { Constants } from "~/utilities"

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

export class Nearby extends AsyncEventEmitter<NearbyEvents> {
	private typingTimeout?: NodeJS.Timeout

	constructor(private readonly client: Client) {
		super()
	}

	/**
	 * Agents within 20 meters of the client's position.
	 */
	get agents() {
		return Array.from(this.client.region.agents.values() ?? []).filter(
			(agent) =>
				agent.entity.key !== this.client.self.key &&
				agent.entity.position &&
				Vector3.distance(this.client.self.position, agent.entity.position) <=
					20,
		)
	}

	/**
	 * Starts typing in the current region.
	 *
	 * @param timeout Optional, milliseconds to wait before stop typing is called.
	 */
	public async startTyping(timeout?: number) {
		clearTimeout(this.typingTimeout)

		if (timeout) {
			this.typingTimeout = setTimeout(() => this.stopTyping(), timeout)
		}

		return this.message("", 0, Constants.ChatTypes.TYPING)
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
			channel >= 0
				? packets.chatFromViewer({
						chatData: {
							channel,
							type,
							message: Buffer.from(`${message}\0`, "utf8"),
						},
					})
				: packets.scriptDialogReply({
						data: {
							objectId: this.client.self.key,
							chatChannel: channel,
							buttonIndex: 0,
							buttonLabel: Buffer.from(`${message}\0`, "utf8"),
						},
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
			packets.ejectUser({ data: { targetId: key, flags: ban ? 1 : 0 } }),
		])
	}

	/**
	 * Freezes the specified agent in the current region.
	 *
	 * @param key The key of the agent to freeze.
	 */
	public freeze(key: string) {
		return this.client.send([
			packets.freezeUser({ data: { targetId: key, flags: 0 } }),
		])
	}

	/**
	 * Unfreezes the specified agent in the current region.
	 *
	 * @param key The key of the agent to unfreeze.
	 */
	public unfreeze(key: string) {
		return this.client.send([
			packets.freezeUser({ data: { targetId: key, flags: 1 } }),
		])
	}

	public async triggerSound(soundId: string, gain = 1) {
		return this.client.send([
			packets.soundTrigger({
				soundData: {
					soundId,
					ownerId: UUID.zero,
					objectId: UUID.zero,
					parentId: UUID.zero,
					handle: this.client.region.handle,
					position: this.client.self.position,
					gain,
				},
			}),
		])
	}
}

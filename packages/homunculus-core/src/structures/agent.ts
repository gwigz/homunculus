import assert from "node:assert"
import type { Client } from ".."
import { ImprovedInstantMessage } from "../network/packets"
import { UUID, Vector3 } from "../network/types"
import Entity, { type IEntityOptions } from "./entity"

export interface IAgentOptions extends IEntityOptions {
	session?: number
	firstname?: string | Buffer
	lastname?: string | Buffer
}

class Agent extends Entity {
	public self: boolean
	public session?: number
	public firstname?: string
	public lastname?: string
	public offset: Array<number> = Vector3.zero
	public health = 100

	constructor(client: Client, data: IAgentOptions) {
		super(client, data)

		this.self = "session" in data

		if (this.self) {
			this.session = data.session
		}

		if (typeof data.firstname === "string") {
			this.firstname = data.firstname
		} else if (data.firstname instanceof Buffer) {
			this.firstname = data.firstname.toString("utf8")
		}

		if (typeof data.lastname === "string") {
			this.lastname = data.lastname
		} else if (data.lastname instanceof Buffer) {
			this.lastname = data.lastname.toString("utf8")
		}
	}

	get name(): string {
		return `${this.firstname} ${this.lastname}`.trim()
	}

	get distance(): number {
		return 0.0
	}

	/**
	 * Sends an instant message to the agent.
	 *
	 * @param message The message to send.
	 */
	public message(message: string) {
		assert(this.client.agent, "Agent is not ready")

		return this.client.send(
			new ImprovedInstantMessage({
				id: this.client.agent.session,
				dialog: 0,
				timestamp: 0,
				fromGroup: false,
				fromAgentName: this.client.agent.name,
				message: `${message}\x00`,
				toAgent: this.id,
				offline: 0,
				parentEstate: 0,
				region: UUID.zero,
				position: Vector3.zero,
				binaryBucket: null,
			}),
		)
	}

	public whisper(message: string, channel = 0) {
		this.client.nearby.whisper(message, channel)
	}

	public say(message: string, channel = 0) {
		this.client.nearby.say(message, channel)
	}

	public shout(message: string, channel = 0) {
		this.client.nearby.shout(message, channel)
	}
}

export default Agent

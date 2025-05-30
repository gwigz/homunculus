import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import type { Client } from "~/client"
import { packets, Quaternion, Vector3 } from "~/network"
import type { Collision } from "~/types"
import { Constants } from "~/utilities"

export interface SelfEvents {
	collision: [collision: Collision]
}

export class Self extends AsyncEventEmitter<SelfEvents> {
	public key: string

	public sessionId: string
	public circuitCode: number

	public firstName = "Loading"
	public lastName = "Loading"

	public state: number = Constants.AgentStates.NONE

	public rotation = Quaternion.identity
	public position = Vector3.zero

	/** If the user is an estate admin in the current region */
	public isEstateManager = false

	/** Linden Damage health */
	public health = 100

	/**
	 * @see {@link https://wiki.secondlife.com/wiki/How_movement_works}
	 */
	public controlFlags = 0

	private lastControlFlags = 0

	private agentUpdateInterval?: NodeJS.Timeout

	constructor(
		private readonly client: Client,
		data: {
			key: string
			sessionId: string
			circuitCode: number
			firstName: string
			lastName: string
			lookAt?: Vector3
			offset?: Vector3
		},
	) {
		super()

		this.key = data.key
		this.sessionId = data.sessionId
		this.circuitCode = data.circuitCode
		this.firstName = data.firstName
		this.lastName = data.lastName
		this.lookAt = data.lookAt ?? Vector3.one

		this.agentUpdateInterval = setInterval(() => {
			if (this.client.status === Constants.Status.READY) {
				this.sendAgentUpdate()
			}
		}, 1_000)
	}

	get name() {
		return `${this.firstName} ${this.lastName ?? ""}`.trim()
	}

	set lookAt(value: Parameters<typeof Quaternion.fromEuler>[0]) {
		this.rotation = Quaternion.fromEuler(value)
	}

	public destroy() {
		clearInterval(this.agentUpdateInterval)

		this.agentUpdateInterval = undefined
	}

	public sendAgentUpdate() {
		this.lastControlFlags = this.controlFlags
		this.controlFlags = 0

		return this.client.send([
			packets.agentUpdate({
				agentData: {
					bodyRotation: this.rotation,
					headRotation: this.rotation,
					state: this.state,
					cameraCenter: this.position,
					cameraAtAxis: Vector3.zero,
					cameraLeftAxis: Vector3.zero,
					cameraUpAxis: Vector3.zero,
					far: 20,
					controlFlags: this.lastControlFlags,
					flags: 0,
				},
			}),
		])
	}

	public sitOnObject(targetId: string) {
		return this.client.send([
			packets.agentRequestSit({
				targetObject: { targetId, offset: Vector3.zero },
			}),
		])
	}

	public sitOnGround() {
		this.controlFlags = Constants.ControlFlags.SIT_ON_GROUND

		return this.sendAgentUpdate()
	}

	public standUp() {
		this.controlFlags = Constants.ControlFlags.STAND_UP

		return this.sendAgentUpdate()
	}
}

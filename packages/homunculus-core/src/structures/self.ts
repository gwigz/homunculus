import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import type { Client } from "~/client"
import {
	type ParcelPropertiesData,
	packets,
	Quaternion,
	Vector3,
} from "~/network"
import { Parcel } from "~/structures"
import type { Collision } from "~/types"
import { Constants } from "~/utilities"

export interface SelfEvents {
	collision: [collision: Collision]
	"parcel-update": [parcel: Parcel]
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

	public cameraAtAxis = new Vector3(0, 1, -0.4)
	public cameraLeftAxis = new Vector3(-1, 0, -4)
	public cameraUpAxis = new Vector3(0, 0.4, 0.9)

	public parcel?: Parcel

	/** If the user is an estate admin in the current region */
	public isEstateManager = false

	/** Linden Damage health */
	public health = 100

	/**
	 * The last parcel sequence ID that was received from the server. This is
	 * used to determine if the current parcel properties has changed.
	 *
	 * @internal
	 */
	public lastParcelSequenceId = -1

	/**
	 * @see {@link https://wiki.secondlife.com/wiki/How_movement_works}
	 */
	public controlFlags = 0

	/**
	 * @internal
	 */
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
		this.lookAt = data.lookAt ?? new Vector3(1, 0, 0)
	}

	get name() {
		return `${this.firstName} ${this.lastName ?? ""}`.trim()
	}

	set lookAt(value: Parameters<typeof Quaternion.fromEuler>[0]) {
		this.rotation = Quaternion.fromEuler(value)
	}

	public updateParcelProperties(data: ParcelPropertiesData) {
		// TODO: remove this once tested
		this.client.emit(
			"debug",
			`Parcel properties updated: ${JSON.stringify(data.parcelData)}`,
		)

		this.lastParcelSequenceId = data.parcelData!.sequenceId
		this.parcel = new Parcel(data)

		this.emit("parcel-update", this.parcel)
	}

	public sendAgentUpdate(
		options: { state?: number; controlFlags?: number } = {},
	) {
		if (options.state !== undefined) {
			this.state = options.state
		}

		if (options.controlFlags !== undefined) {
			this.controlFlags = options.controlFlags
		}

		return this.client.send([
			packets.agentUpdate({
				agentData: {
					bodyRotation: this.rotation,
					headRotation: this.rotation,
					state: this.state,
					cameraCenter: this.position,
					cameraAtAxis: this.cameraAtAxis,
					cameraLeftAxis: this.cameraLeftAxis,
					cameraUpAxis: this.cameraUpAxis,
					far: 32,
					controlFlags: this.controlFlags,
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

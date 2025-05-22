import { type Client, Constants } from ".."
import { AgentUpdate } from "../network/packets"

class Self {
	public key: string

	/** Session ID */
	public session?: number

	public firstName?: string
	public lastName?: string

	public state: number = Constants.AgentStates.NONE

	public rotation: [x: number, y: number, z: number, w: number] = [0, 0, 0, 1]
	public position?: [x: number, y: number, z: number] = [0, 0, 0]

	/** Global coordinate offset */
	public offset?: [number, number, number]

	/** Linden Damage health */
	public health = 100

	/**
	 * @see {@link https://wiki.secondlife.com/wiki/How_movement_works}
	 */
	public controlFlags = 0

	private agentUpdateInterval?: NodeJS.Timeout

	constructor(
		public readonly client: Client,
		data: {
			key: string
			session?: number
			firstName?: string
			lastName?: string
		},
	) {
		this.key = data.key
		this.session = data.session
		this.firstName = data.firstName
		this.lastName = data.lastName

		this.agentUpdateInterval = setInterval(() => this.sendAgentUpdate(), 1_000)
	}

	public destroy() {
		clearInterval(this.agentUpdateInterval)

		this.agentUpdateInterval = undefined
	}

	get name() {
		return this.firstName
			? `${this.firstName} ${this.lastName ?? ""}`.trim()
			: undefined
	}

	public sendAgentUpdate() {
		if (this.client.status !== Constants.Status.READY) {
			return
		}

		this.client.send([
			new AgentUpdate({
				bodyRotation: this.rotation,
				headRotation: this.rotation,
				state: this.state,
				cameraCenter: this.position,
				cameraAtAxis: [0.0, 0.0, 0.0],
				cameraLeftAxis: [0.0, 0.0, 0.0],
				cameraUpAxis: [0.0, 0.0, 0.0],
				far: 20,
				controlFlags: this.controlFlags,
				flags: 0,
			}),
		])
	}
}

export default Self

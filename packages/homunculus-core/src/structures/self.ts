import type { Client } from ".."

class Self {
	public key: string

	/** Session ID */
	public session?: number

	public firstName?: string
	public lastName?: string

	public state = 0

	public rotation?: [x: number, y: number, z: number, w: number]
	public position?: [x: number, y: number, z: number]

	/** Global coordinate offset */
	public offset?: [number, number, number]

	/** Linden Damage health */
	public health = 100

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
	}

	get name() {
		return this.firstName
			? `${this.firstName} ${this.lastName ?? ""}`.trim()
			: undefined
	}
}

export default Self

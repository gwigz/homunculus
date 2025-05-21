import type { Client } from ".."

class Self {
	public key: string

	/** Session ID */
	public session?: number

	public firstname?: string
	public lastname?: string

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
			firstname?: string
			lastname?: string
		},
	) {
		this.key = data.key
		this.session = data.session
		this.firstname = data.firstname
		this.lastname = data.lastname
	}

	get name() {
		return `${this.firstname} ${this.lastname}`.trim()
	}
}

export default Self

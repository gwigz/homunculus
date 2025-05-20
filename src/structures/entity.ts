import type { Client } from ".."
import { Quaternion, U8, UUID, Vector3 } from "../network/types"

export interface IEntityOptions {
	id: number
	key: string
	parent?: number
	state?: number
	owner?: string
	flags?: number
	position?: Array<number>
	velocity?: Array<number>
	rotation?: Array<number>
	scale?: Array<number>
	text?:
		| { value: string; color: Array<number> }
		| { value: Buffer; color: Buffer }
	material?: number // Constants.ObjectMaterials
	tree?: number // Constants.ObjectTrees
	action?: number // Constants.ObjectActions
	children?: Array<number>
}

class Entity {
	/**
	 * Local ID for this Entity.
	 */
	public id: number

	/**
	 * UUID for this Entity.
	 */
	public key: string

	/**
	 * Entity parent, undefined if root.
	 */
	public parent?: number

	/**
	 * Entity state, which probably refers to an attachment point index for
	 * it's parent ID.
	 */
	public state: number

	/**
	 * Owners UUID for this Entity.
	 */
	public owner: string

	/**
	 * Entity flags, see `Constants.ObjectFlags` for context.
	 */
	public flags: number

	/**
	 * Current position of Entity.
	 */
	public position: Array<number>

	/**
	 * Current velocity of Entity.
	 */
	public velocity: Array<number>

	/**
	 * Current rotation of Entity.
	 */
	public rotation: Array<number>

	/**
	 * Scale of Entity.
	 */
	public scale: Array<number>

	/**
	 * Floating text, object contains text and color values.
	 */
	public text?: { value: string; color: Array<number> }

	/**
	 * Material type, see `Constants.ObjectMaterials` for context.
	 */
	public material: number // TODO: enums based on Constants.ObjectMaterials

	/**
	 * Tree type, see `Constants.ObjectTrees` for context.
	 */
	public tree?: number // TODO: enums based on Constants.ObjectTrees

	/**
	 * Default click action, see `Constants.ObjectActions` for context.
	 */
	public action: number // TODO: enums based on Constants.ObjectActions

	/**
	 * Local ID values of all children relating to this object.
	 */
	public children: Array<number>

	/**
	 * @param client The Client that instantiated this Entity.
	 */
	constructor(
		public readonly client: Client,
		data: IEntityOptions,
	) {
		this.id = data.id
		this.key = data.key ?? UUID.zero
		this.parent = data.parent
		this.state = data.state ?? 0
		this.owner = data.owner ?? UUID.zero
		this.flags = data.flags ?? 0
		this.position = data.position ?? Vector3.zero
		this.velocity = data.velocity ?? Vector3.zero
		this.rotation = data.rotation ?? Quaternion.zero
		this.scale = data.scale ?? Vector3.zero

		this.text = data.text
			? {
					value:
						typeof data.text.value === "string"
							? data.text.value
							: data.text.value.toString("utf8"),

					color: Array.isArray(data.text.color)
						? data.text.color
						: data.text.color.length === 4
							? [
									U8.fromBuffer(data.text.color, 0),
									U8.fromBuffer(data.text.color, 1),
									U8.fromBuffer(data.text.color, 2),
									U8.fromBuffer(data.text.color, 3),
								]
							: [0, 0, 0, 0],
				}
			: undefined

		/**
		 * Material type, see `Constants.ObjectMaterials` for context.
		 * @type {number}
		 */
		this.material = data.material ?? 0

		/**
		 * Tree type, see `Constants.ObjectTrees` for context.
		 * @type {number}
		 */
		this.tree = data.tree ?? 0

		/**
		 * Default click action, see `Constants.ObjectActions` for context.
		 * @type {number}
		 */
		this.action = data.action ?? 0

		/**
		 * Local ID values of all children relating to this object.
		 * @type {number[]}
		 */
		this.children = []
	}

	get distance(): number {
		return this.client.agent
			? Vector3.distance(this.client.agent.position, this.position)
			: -1
	}
}

export default Entity

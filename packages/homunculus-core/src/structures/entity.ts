import type { Client } from "~/client"
import { Color4, type Quaternion, UUID, Vector3 } from "~/network"

export interface EntityOptions {
	id: number
	key: string
	parent?: number
	state?: number
	owner?: string
	type?: number
	flags?: number
	position?: Vector3
	velocity?: Vector3
	rotation?: Quaternion
	scale?: Vector3
	text?: { value: string; color: Color4 } | { value: Buffer; color: Buffer }
	material?: number // Constants.ObjectMaterials
	tree?: number // Constants.ObjectTrees
	action?: number // Constants.ObjectActions
	children?: Array<number>
}

export class Entity {
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
	 * Type (PCode) for this Entity, see `Constants.ObjectTypes` for context.
	 */
	public type = 0

	/**
	 * Entity flags, see `Constants.ObjectFlags` for context.
	 */
	public flags: number

	/**
	 * Entity name.
	 */
	public name?: string

	/**
	 * Current position of Entity.
	 */
	public position?: Vector3

	/**
	 * Current velocity of Entity.
	 */
	public velocity?: Vector3

	/**
	 * Current acceleration of Entity.
	 */
	public acceleration?: Vector3

	/**
	 * Current angular velocity of Entity.
	 */
	public angularVelocity?: Vector3

	/**
	 * Current rotation of Entity.
	 */
	public rotation?: Quaternion

	/**
	 * Scale of Entity.
	 */
	public scale?: Vector3

	/**
	 * Floating text, object contains text and color values.
	 */
	public text?: { value: string; color?: Color4 }

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
	public children: Array<number> = []

	/**
	 * Whether this entity has been deleted.
	 */
	public dead = false

	/**
	 * @param client The Client that instantiated this Entity.
	 * @internal
	 */
	constructor(
		private readonly client: Client,
		data: EntityOptions | Entity,
	) {
		this.id = data.id
		this.key = data.key ?? UUID.zero
		this.parent = data.parent
		this.state = data.state ?? 0
		this.owner = data.owner ?? UUID.zero
		this.type = data.type ?? 0
		this.flags = data.flags ?? 0
		this.position = data.position
		this.velocity = data.velocity
		this.rotation = data.rotation
		this.scale = data.scale

		this.text = data.text
			? {
					value:
						typeof data.text.value === "string"
							? data.text.value
							: data.text.value.toString("utf8").slice(0, -1),

					color:
						data.text.color instanceof Color4
							? data.text.color
							: data.text.color?.length === 4
								? Color4.fromBuffer(data.text.color)
								: undefined,
				}
			: undefined

		this.material = data.material ?? 0
		this.tree = data.tree ?? 0
		this.action = data.action ?? 0
	}

	get distance(): number {
		return this.position
			? Vector3.distance(this.client.self.position, this.position)
			: -1
	}
}

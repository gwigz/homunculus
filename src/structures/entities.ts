import type Entity from "./entity"

class Entities extends Map<number, Entity> {
	private register = new Map<string, number>()

	public lookup(key: string) {
		if (this.register.has(key)) {
			return this.get(this.register.get(key)!)
		}

		return null
	}

	public set(id: number, entity: Entity): this {
		super.set(id, entity)

		this.register.set(entity.key, id)

		return this
	}

	public delete(id: number): boolean {
		const entity = this.get(id)

		if (entity) {
			this.register.delete(entity.key)
		}

		return super.delete(id)
	}
}

export default Entities

import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import type { Entity } from "./entity"

export interface EntitiesEvents {
	set: [entity: Entity]
	delete: [id: number]
}

export class Entities extends AsyncEventEmitter<EntitiesEvents> {
	private entities = new Map<number, Entity>()
	private register = new Map<string, number>()

	public has(id: number) {
		return this.entities.has(id)
	}

	public lookup(key: string) {
		if (this.register.has(key)) {
			return this.entities.get(this.register.get(key)!)
		}

		return null
	}

	public get(id: number) {
		return this.entities.get(id)
	}

	public set(id: number, entity: Entity) {
		this.entities.set(id, entity)
		this.register.set(entity.key, id)

		this.emit("set", entity)

		return this
	}

	public delete(id: number) {
		this.emit("delete", id)

		return this.entities.delete(id)
	}

	public entries() {
		return this.entities.entries()
	}

	public values() {
		return this.entities.values()
	}

	public keys() {
		return this.entities.keys()
	}

	public get size() {
		return this.entities.size
	}
}

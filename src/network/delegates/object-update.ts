import { Entity } from "../../structures"
import { Constants } from "../../utilities"

import Delegate from "./delegate"

class ObjectUpdate extends Delegate {
	public handle(packet): void {
		const handle = packet.data.regionData[0].regionHandle
		const region = this.region(handle)

		if (!region) {
			throw Error(Constants.Errors.UNEXPECTED_OBJECT_UPDATE)
		}

		for (const data of packet.data.objectData) {
			const entity = region.objects.get(data.id)

			if (entity) {
				this.update(entity, data)
			} else {
				this.insert(data, region)
			}
		}
	}

	public update(entity, data): Entity {
		// data.data
		// data.objectData
		// data.extraParams

		entity.id = data.id
		entity.key = data.uuid
		entity.parent = data.parent
		entity.owner = data.owner
		entity.scale = data.scale
		entity.flags = data.flags
		entity.text = { value: data.text, color: data.textColor }

		return entity
	}

	public insert(data, region): Entity {
		const entity = new Entity(this.client, this.update({}, data))

		// Pass to regions entity collection.
		region.objects.set(entity.id, entity)

		return entity
	}
}

export default ObjectUpdate

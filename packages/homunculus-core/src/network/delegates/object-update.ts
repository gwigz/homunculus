import { Agent, Entity, type Region } from "../../structures"
import type { EntityOptions } from "../../structures/entity"
import { Constants } from "../../utilities"
import type { ObjectUpdate as ObjectUpdatePacket } from "../packets"
import Delegate from "./delegate"

class ObjectUpdate extends Delegate {
	public handle(packet: ObjectUpdatePacket) {
		const handle = packet.data.regionData[0].regionHandle
		const region = this.client.regions.get(handle)

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

	public update(entity: Entity | EntityOptions, data: any) {
		entity.id = data.id
		entity.key = data.uuid
		entity.parent = data.parent
		entity.owner = data.owner
		entity.type = data.pCode
		entity.scale = data.scale
		entity.flags = data.flags

		entity.text =
			data.text?.length > 1 ? { value: data.text.slice(0, -1) } : undefined

		return entity
	}

	public insert(data: any, region: Region): Entity {
		const entity = new Entity(
			this.client,
			this.update({} as EntityOptions, data),
		)

		region.objects.set(entity.id, entity)

		if (entity.type === 47) {
			region.agents.set(entity.key, new Agent(this.client, entity))
		}

		return entity
	}
}

export default ObjectUpdate

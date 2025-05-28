import type { ObjectUpdate, ObjectUpdateData } from "~/network/packets"
import { Agent, Entity, type Region } from "~/structures"
import type { EntityOptions } from "~/structures/entity"
import { Constants } from "~/utilities"
import { Delegate } from "./delegate"

type ObjectData = Required<NonNullable<ObjectUpdateData["objectData"]>[number]>

class ObjectUpdateDelegate extends Delegate {
	public override handle(packet: ObjectUpdate) {
		const handle = packet.data.regionData!.regionHandle
		const region = this.client.regions.get(handle)

		if (!region) {
			throw Error(Constants.Errors.UNEXPECTED_OBJECT_UPDATE)
		}

		for (const data of packet.data.objectData!) {
			const entity = region.objects.get(data.id)

			if (entity) {
				this.update(entity, data)
			} else {
				this.insert(region, data)
			}
		}
	}

	public update(entity: Entity | EntityOptions, data: ObjectData) {
		entity.id = data.id
		entity.key = data.fullId
		entity.parent = data.parentId
		entity.owner = data.ownerId
		entity.type = data.pCode
		entity.scale = data.scale
		entity.flags = data.flags

		entity.text =
			data.text?.length > 1
				? { value: data.text.toString("utf8").slice(0, -1) }
				: undefined

		return entity
	}

	public insert(region: Region, data: ObjectData): Entity {
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

export default ObjectUpdateDelegate

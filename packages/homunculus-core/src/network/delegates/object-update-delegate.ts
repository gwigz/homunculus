import { type ObjectUpdateData, packets } from "~/network"
import { Agent, Entity } from "~/structures"
import type { EntityOptions } from "~/structures/entity"
import { Constants } from "~/utilities"

type ObjectData = Required<NonNullable<ObjectUpdateData["objectData"]>[number]>

function updateEntity(entity: Entity | EntityOptions, data: ObjectData) {
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

packets.createObjectUpdateDelegate({
	handle: (packet, context) => {
		const handle = packet.data.regionData!.regionHandle
		const region = context.client.regions.get(handle)

		if (!region) {
			throw Error(Constants.Errors.UNEXPECTED_OBJECT_UPDATE)
		}

		for (const objectData of packet.data.objectData!) {
			const entity = region.objects.get(objectData.id)

			if (entity) {
				updateEntity(entity, objectData)
			} else {
				const entity = new Entity(
					context.client,
					updateEntity({} as EntityOptions, objectData),
				)

				region.objects.set(entity.id, entity)

				if (entity.type === 47) {
					region.agents.set(entity.key, new Agent(context.client, entity))
				}
			}
		}
	},
})

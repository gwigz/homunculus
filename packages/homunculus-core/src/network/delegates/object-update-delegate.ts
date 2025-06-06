/** biome-ignore-all lint/suspicious/noFallthroughSwitchClause: okay */
import assert from "node:assert"
import {
	type ObjectUpdateData,
	PacketBuffer,
	packets,
	Quaternion,
	U8,
	U16,
	Vector3,
	Vector4,
} from "~/network"
import { Agent, Entity } from "~/structures"
import type { EntityOptions } from "~/structures/entity"
import { Constants } from "~/utilities"

type ObjectData = Required<NonNullable<ObjectUpdateData["objectData"]>[number]>

const SIZE = 256.0
const MIN_HEIGHT = -SIZE
const MAX_HEIGHT = 4096.0
const XY_RANGE = [-0.5 * SIZE, 1.5 * SIZE] as const
const Z_RANGE = [MIN_HEIGHT, MAX_HEIGHT] as const

const EXPECTED_OBJECT_DATA_LENGTHS = [76, 60, 48, 32, 16]

function readPositionU16(buffer: PacketBuffer): Vector3 {
	return new Vector3(
		U16.toFloat(buffer.read(U16), XY_RANGE[0], XY_RANGE[1]),
		U16.toFloat(buffer.read(U16), XY_RANGE[0], XY_RANGE[1]),
		U16.toFloat(buffer.read(U16), Z_RANGE[0], Z_RANGE[1]),
	)
}

function readPositionU8(buffer: PacketBuffer): Vector3 {
	return new Vector3(
		U8.toFloat(buffer.read(U8), XY_RANGE[0], XY_RANGE[1]),
		U8.toFloat(buffer.read(U8), XY_RANGE[0], XY_RANGE[1]),
		U8.toFloat(buffer.read(U8), Z_RANGE[0], Z_RANGE[1]),
	)
}

// http://wiki.secondlife.com/wiki/ObjectUpdate#ObjectData_Format
export function updateEntityFromObjectData(
	entity: Entity | EntityOptions,
	buffer: PacketBuffer,
) {
	switch (buffer.length) {
		case 76:
			// skip collision plane
			buffer.skip(Vector4.size)
		case 60:
			// full precision
			entity.position = buffer.read(Vector3)
			entity.velocity = buffer.read(Vector3)
			entity.acceleration = buffer.read(Vector3)
			entity.rotation = buffer.read(Quaternion, false) // not normalized (Vector3)
			entity.angularVelocity = buffer.read(Vector3)
			break

		case 48:
			// skip collision plane
			buffer.skip(Vector4.size)
		case 32:
			// half precision
			entity.position = readPositionU16(buffer)
			entity.velocity = buffer.read(Vector3, U16, -SIZE, SIZE)
			entity.acceleration = buffer.read(Vector3, U16, -SIZE, SIZE)
			entity.rotation = buffer.read(Quaternion, true, U16, -1.0, 1.0)
			entity.angularVelocity = buffer.read(Vector3, U16, -SIZE, SIZE)
			break

		case 16:
			// low precision
			entity.position = readPositionU8(buffer)
			entity.velocity = buffer.read(Vector3, U8, -SIZE, SIZE)
			entity.acceleration = buffer.read(Vector3, U8, -SIZE, SIZE)
			entity.rotation = buffer.read(Quaternion, true, U8, -1.0, 1.0)
			entity.angularVelocity = buffer.read(Vector3, U8, -SIZE, SIZE)
			break
	}
}

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

	updateEntityFromObjectData(
		entity,
		new PacketBuffer(data.objectData as Buffer, true),
	)

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

			assert(
				EXPECTED_OBJECT_DATA_LENGTHS.includes(
					(objectData.objectData! as Buffer).length,
				),
				Constants.Errors.UNEXPECTED_OBJECT_UPDATE_LENGTH.replace(
					"%d",
					(objectData.objectData! as Buffer).length.toString(),
				),
			)

			if (entity) {
				updateEntity(entity, objectData)
			} else {
				const entity = new Entity(
					context.client,
					updateEntity({} as EntityOptions, objectData),
				)

				region.objects.set(entity.id, entity)

				if (entity.type === 47) {
					region.agents.set(
						entity.key,
						new Agent(context.client, entity.key, entity),
					)
				}
			}
		}
	},
})

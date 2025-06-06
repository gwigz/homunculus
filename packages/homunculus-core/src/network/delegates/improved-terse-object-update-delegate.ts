import assert from "node:assert"
import {
	Bool,
	PacketBuffer,
	packets,
	Quaternion,
	U8,
	U16,
	U32,
	Vector3,
	Vector4,
} from "~/network"
import type { Entity, EntityOptions } from "~/structures"
import { Constants } from "~/utilities"

export function updateEntityFromTerseObjectUpdate(
	entity: Entity | EntityOptions,
	buffer: PacketBuffer,
) {
	entity.state = buffer.read(U8)

	// if this is an avatar, skip the "foot" collision plane
	if (buffer.read(Bool)) {
		buffer.skip(Vector4.size)
	}

	entity.position = buffer.read(Vector3)
	entity.velocity = buffer.read(Vector3, U16, -128, 128)
	entity.acceleration = buffer.read(Vector3, U16, -64, 64)
	entity.rotation = buffer.read(Quaternion, false, U16, -1, 1)
	entity.angularVelocity = buffer.read(Vector3, U16, -64, 64)
}

packets.createImprovedTerseObjectUpdateDelegate({
	handle: (packet, context) => {
		const handle = packet.data.regionData!.regionHandle
		const region = context.client.regions.get(handle)

		assert(region, Constants.Errors.UNEXPECTED_OBJECT_UPDATE)

		const missing = [] as number[]

		for (const { data } of packet.data.objectData!) {
			const buffer = new PacketBuffer(data as Buffer, true)

			assert(
				// 44, or 60 for avatars (see below)
				buffer.length === 44 || buffer.length === 60,
				Constants.Errors.UNEXPECTED_OBJECT_UPDATE_LENGTH.replace(
					"%d",
					buffer.length.toString(),
				),
			)

			const id = buffer.read(U32)
			const entity = region.objects.get(id)

			if (!entity) {
				missing.push(id)

				// cannot process this update, we need to request the object
				continue
			}

			updateEntityFromTerseObjectUpdate(entity, buffer)

			if (entity.type === 47 && entity.key === context.client.self.key) {
				context.client.self.state = entity.state
				context.client.self.position = entity.position!
				context.client.self.rotation = entity.rotation!
			}
		}

		for (let i = 0; i < missing.length; i += 255) {
			context.circuit.sendReliable([
				packets.requestMultipleObjects({
					objectData: missing
						.slice(i, i + 255)
						.map((id) => ({ id, cacheMissType: 0 })),
				}),
			])
		}
	},
})

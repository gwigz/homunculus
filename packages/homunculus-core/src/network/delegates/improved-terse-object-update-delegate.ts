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
import { Constants } from "~/utilities"

packets.createImprovedTerseObjectUpdateDelegate({
	handle: (packet, context) => {
		const handle = packet.data.regionData!.regionHandle
		const region = context.client.regions.get(handle)

		if (!region) {
			throw Error(Constants.Errors.UNEXPECTED_OBJECT_UPDATE)
		}

		const missing = [] as number[]

		for (const { data } of packet.data.objectData!) {
			const buffer = new PacketBuffer(data as Buffer, true)

			if (buffer.length !== 44 && buffer.length !== 60) {
				throw Error(Constants.Errors.UNEXPECTED_OBJECT_UPDATE_LENGTH)
			}

			const id = buffer.read(U32)
			const entity = region.objects.get(id)

			if (!entity) {
				missing.push(id)

				continue
			}

			entity.state = buffer.read(U8)

			// next byte defines if this update is for an avatar or not
			if (buffer.read(Bool)) {
				// this contains a normal and Z position for the avatars foot shadow,
				// we don't use these at the moment for anything, so don't include them
				// for now...
				buffer.read(Vector4)
			}

			entity.position = buffer.read(Vector3)
			entity.velocity = buffer.read(Vector3, U16, -128, 128)
			entity.acceleration = buffer.read(Vector3, U16, -64, 64)
			entity.rotation = buffer.read(Quaternion, false, U16, -1.0, 1.0)
			entity.angularVelocity = buffer.read(Vector3, U16, -64.0, 64.0)

			if (entity.type === 47 && entity.key === context.client.self.key) {
				context.client.self.state = entity.state
				context.client.self.position = entity.position!
				context.client.self.rotation = entity.rotation!
			}
		}

		for (let i = 0; i < missing.length; i += 255) {
			context.circuit.send([
				packets.requestMultipleObjects({
					objectData: missing.slice(i, i + 255).map((id) => ({
						id,
						cacheMissType: 0,
					})),
				}),
			])
		}
	},
})

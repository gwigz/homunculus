import {
	Color4,
	F32,
	PacketBuffer,
	ParticleSystem,
	packets,
	Text,
	U8,
	U16,
	U32,
	UUID,
	Variable1,
	Vector3,
} from "~/network"
import { Agent, Entity } from "~/structures"
import { Constants } from "~/utilities"
import {
	type CompressedObjectProperties,
	CompressedObjectValue,
} from "../helpers/compressed-object-value"

const Flags = {
	NONE: 0x0,
	SCRATCH_PAD: 0x01,
	TREE_TYPE: 0x02,
	TEXT: 0x04,
	PARTICLES: 0x08,
	SOUND_DATA: 0x10,
	PARENT: 0x20,
	TEXTURE_ANIMATION: 0x40,
	ANGULAR_VELOCITY: 0x80,
	NAME: 0x100,
	MEDIA_URL: 0x200,
}

// const ParameterTypes = {
// 	FLEXIBLE: 0x10,
// 	LIGHT: 0x20,
// 	SCULPT: 0x30,
// 	LIGHT_IMAGE: 0x40,
// 	MESH: 0x50,
// }

const compressedObjectProperties: CompressedObjectProperties = [
	["type", U8],
	["state", U8],
	["crc", U32],
	["material", U8],
	["action", U8],
	["scale", Vector3],
	["position", Vector3],
	["rotation", Vector3],
	["flags", U32],
	["owner", UUID],
	[
		"velocity.angular",
		new CompressedObjectValue(Vector3, Flags.ANGULAR_VELOCITY),
	],
	["parent", new CompressedObjectValue(U32, Flags.PARENT, 0)],
	["tree", new CompressedObjectValue(U8, Flags.TREE_TYPE)],
	["data", new CompressedObjectValue(Variable1, Flags.SCRATCH_PAD)],
	["text.value", new CompressedObjectValue(Text, Flags.TEXT)],
	["text.color", new CompressedObjectValue(Color4, Flags.TEXT)],
	["media.url", new CompressedObjectValue(Text, Flags.MEDIA_URL)],
	["particles", new CompressedObjectValue(ParticleSystem, Flags.PARTICLES)],
	["parameters", 0],
	["sound.key", new CompressedObjectValue(UUID, Flags.SOUND_DATA)],
	["sound.gain", new CompressedObjectValue(F32, Flags.SOUND_DATA)],
	["sound.flags", new CompressedObjectValue(U8, Flags.SOUND_DATA)],
	["sound.radius", new CompressedObjectValue(F32, Flags.SOUND_DATA)],
	["name", new CompressedObjectValue(Text, Flags.NAME)],
	// ['path.curve', U8],
	// ['path.begin', U16],
	// ['path.end', U16],
	// ['path.scale.x', U8],
	// ['path.scale.y', U8],
	// ['path.shear.x', U8],
	// ['path.shear.y', U8],
	// ['path.twist.length', S8],
	// ['path.twist.begin', S8],
	// ['path.radius.offset', S8],
	// ['path.taper.y', S8],
	// ['path.taper.x', S8],
	// ['path.revolutions', U8],
	// ['path.skew', S8],
	// ['profile.curve', U8],
	// ['profile.begin', U16],
	// ['profile.end', U16],
	// ['profile.hollow', U16],
	// ['textures', Variable4],
	// ['animation', new CompressedObjectValue(U32, Flags.TEXTURE_ANIMATION)]
]

function updateEntity(entity: Entity, buffer: PacketBuffer) {
	let flags = Flags.NONE

	for (const [key, type] of compressedObjectProperties) {
		if (key === "parameters") {
			const count = buffer.read(U8)

			// skip parameters for now
			// this just contains flex, light, mesh, and sculpt data
			for (let i = 0; i < count; i++) {
				buffer.skip(U16.size)
				buffer.skip(buffer.read(U32))
			}

			continue
		}

		const value =
			type instanceof CompressedObjectValue
				? type.read(buffer, flags)
				: buffer.read(type)

		if (value === undefined) {
			continue
		}

		switch (key) {
			case "flags":
				flags = value
				break

			case "velocity.angular":
			case "tree":
			case "data":
			case "media.url":
			case "particles":
			case "parameters":
			case "sound.key":
			case "sound.gain":
			case "sound.flags":
			case "sound.radius":
				// ignored values, for now
				break

			case "text.value":
				if (value?.length > 1) {
					if (entity.text) {
						entity.text.value = value.slice(0, -1)
					} else {
						entity.text = {
							value: value.slice(0, -1),
							color: Color4.zero,
						}
					}
				} else {
					entity.text = undefined
				}
				break

			case "text.color":
				if (entity.text) {
					entity.text.color = value
				}
				break

			case "name":
				entity.name = value
				break

			default:
				// @ts-ignore fix later
				entity[key] = value
				break
		}
	}

	return entity
}

packets.createObjectUpdateCompressedDelegate({
	handle: (packet, context) => {
		const handle = packet.data.regionData!.regionHandle
		const region = context.client.regions.get(handle)

		if (!region) {
			throw Error(Constants.Errors.UNEXPECTED_OBJECT_UPDATE)
		}

		for (const objectData of packet.data.objectData!) {
			const buffer = new PacketBuffer(objectData.data as Buffer, true)
			const flags = objectData.updateFlags
			const key = buffer.read(UUID) as string
			const id = buffer.read(U32) as number

			const insert = !region.objects.has(id)

			try {
				const entity = insert
					? updateEntity(new Entity(context.client, { id, key, flags }), buffer)
					: updateEntity(region.objects.get(id)!, buffer)

				entity.flags |= flags

				if (insert) {
					region.objects.set(id, entity)

					if (entity.type === 47) {
						region.agents.set(entity.key, new Agent(context.client, entity))
					}
				}

				if (entity.type === 47 && entity.key === context.client.self.key) {
					context.client.self.state = entity.state
					context.client.self.position = entity.position!
					context.client.self.rotation = entity.rotation!
				}
			} catch (error) {
				context.client.emit("debug", `Error updating object "${key}".`)
				context.client.emit("error", error as Error)
			}
		}
	},
})

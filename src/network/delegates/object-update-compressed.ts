import PacketBuffer from "../helpers/packet-buffer"
import CompressedObjectValue, {
	type CompressedObjectProperties,
} from "./compressed-object-value"
import Delegate from "./delegate"

import { Entity, type Region } from "../../structures"
import { Constants } from "../../utilities"

import * as Types from "../types"

const Flags = {
	NONE: 0x00,
	SCRATCH_PAD: 0x01,
	TREE_TYPE: 0x02,
	TEXT: 0x04,
	PARTICALS: 0x08,
	SOUND_DATA: 0x10,
	PARENT: 0x20,
	TEXTURE_ANIMATION: 0x40,
	ANGULAR_VELOCITY: 0x80,
	NAME: 0x100,
	MEDIA_URL: 0x200,
}

const compressedObjectProperties: CompressedObjectProperties = [
	["type", Types.U8],
	["state", Types.U8],
	["crc", Types.U32],
	["material", Types.U8],
	["action", Types.U8],
	["scale", Types.Vector3],
	["position", Types.Vector3],
	["rotation", Types.Vector3],
	["flags", Types.U32],
	["owner", Types.UUID],
	[
		"velocity.angular",
		new CompressedObjectValue(Types.Vector3, Flags.ANGULAR_VELOCITY),
	],
	["parent", new CompressedObjectValue(Types.U32, Flags.PARENT)],
	["tree", new CompressedObjectValue(Types.U8, Flags.TREE_TYPE)],
	["data", new CompressedObjectValue(Types.Variable1, Flags.SCRATCH_PAD)],
	["text.value", new CompressedObjectValue(Types.Text, Flags.TEXT)],
	// ['text.color', new CompressedObjectValue(Types.U32, Flags.TEXT)] <- this is 4 U8s
]

// ['media.url', new CompressedObjectValue(Types.Text, Flags.MEDIA_URL)],
// ['particles', new CompressedObjectValue(Types.ParticleData, Flags.PARTICALS)],
// ['parameters', Types.Variable1],
// ['sound.key', new CompressedObjectValue(Types.UUID, Flags.SOUND_DATA)],
// ['sound.gain', new CompressedObjectValue(Types.U32, Flags.SOUND_DATA)],
// ['sound.flags', new CompressedObjectValue(Types.U8, Flags.SOUND_DATA)],
// ['sound.radius', new CompressedObjectValue(Types.U32, Flags.SOUND_DATA)],
// ['name', new CompressedObjectValue(Types.Text, Flags.NAME)],
// ['path.curve', Types.U8],
// ['path.begin', Types.U16],
// ['path.end', Types.U16],
// ['path.scale.x', Types.U8],
// ['path.scale.y', Types.U8],
// ['path.shear.x', Types.U8],
// ['path.shear.y', Types.U8],
// ['path.twist.length', Types.S8],
// ['path.twist.begin', Types.S8],
// ['path.radius.offset', Types.S8],
// ['path.taper.y', Types.S8],
// ['path.taper.x', Types.S8],
// ['path.revolutions', Types.U8],
// ['path.skew', Types.S8],
// ['profile.curve', Types.U8],
// ['profile.begin', Types.U16],
// ['profile.end', Types.U16],
// ['profile.hollow', Types.U16],
// ['textures', Types.Variable4],
// ['animation', new CompressedObjectValue(Types.U32, Flags.TEXTURE_ANIMATION)]

class ObjectUpdateCompressed extends Delegate {
	public handle(packet): void {
		const handle = packet.data.regionData[0].regionHandle
		const region = this.region(handle)

		if (!region) {
			throw Error(Constants.Errors.UNEXPECTED_OBJECT_UPDATE)
		}

		for (const data of packet.data.objectData) {
			const buffer = new PacketBuffer(data.data, true)
			const flags = data.updateFlags
			const key = buffer.read(Types.UUID) as string
			const id = buffer.read(Types.U32) as number
			const entity = region.objects.get(id)

			if (entity) {
				this.update(entity, buffer)
				entity.flags |= flags
			} else {
				this.insert(id, key, buffer, flags, region)
			}
		}
	}

	public update(entity: Entity, buffer: PacketBuffer) {
		const flags = Flags.NONE

		for (const [key, type] of compressedObjectProperties) {
			const value =
				type instanceof CompressedObjectValue
					? type.read(buffer, flags)
					: buffer.read(type)

			if (value === undefined) {
				continue
			}

			// TODO: this is shit, and unfinished
			switch (key) {
				case "velocity.angular":
				case "data":
					// Ignored values, for now.
					break

				case "text.value":
					if (entity.text) {
						entity.text.value = value
					} else {
						entity.text = {
							value: value,
							color: Types.Vector4.zero,
						}
					}
					break

				case "text.color":
					if (entity.text) {
						entity.text.color = value
					} else {
						entity.text = {
							value: "",
							color: value,
						}
					}
					break

				default:
					entity[key] = value
					break
			}
		}

		return entity
	}

	public insert(
		id: number,
		key: string,
		buffer: PacketBuffer,
		flags: number,
		region: Region,
	): Entity {
		const entity = this.update(
			new Entity(this.client, { id, key, flags }),
			buffer,
		)

		// Pass to entity collection.
		region.objects.set(entity.id, entity)

		return entity
	}
}

export default ObjectUpdateCompressed

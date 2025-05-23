import { Agent, Entity } from "../../structures"
import { Constants } from "../../utilities"
import PacketBuffer from "../helpers/packet-buffer"
import type { ObjectUpdateCompressed } from "../packets"
import * as Types from "../types"
import CompressedObjectValue, {
	type CompressedObjectProperties,
} from "./compressed-object-value"
import Delegate from "./delegate"

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
	["parent", new CompressedObjectValue(Types.U32, Flags.PARENT, 0)],
	["tree", new CompressedObjectValue(Types.U8, Flags.TREE_TYPE)],
	["data", new CompressedObjectValue(Types.Variable1, Flags.SCRATCH_PAD)],
	["text.value", new CompressedObjectValue(Types.Text, Flags.TEXT)],
	["text.color", new CompressedObjectValue(Types.Color4, Flags.TEXT)],
	["media.url", new CompressedObjectValue(Types.Text, Flags.MEDIA_URL)],
	[
		"particles",
		new CompressedObjectValue(Types.ParticleSystem, Flags.PARTICLES),
	],
	["parameters", 0],
	["sound.key", new CompressedObjectValue(Types.UUID, Flags.SOUND_DATA)],
	["sound.gain", new CompressedObjectValue(Types.F32, Flags.SOUND_DATA)],
	["sound.flags", new CompressedObjectValue(Types.U8, Flags.SOUND_DATA)],
	["sound.radius", new CompressedObjectValue(Types.F32, Flags.SOUND_DATA)],
	["name", new CompressedObjectValue(Types.Text, Flags.NAME)],
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
]

class ObjectUpdateCompressedDelegate extends Delegate {
	public handle(packet: ObjectUpdateCompressed) {
		const handle = packet.data.regionData[0].regionHandle
		const region = this.client.regions.get(handle)

		if (!region) {
			throw Error(Constants.Errors.UNEXPECTED_OBJECT_UPDATE)
		}

		for (const data of packet.data.objectData) {
			const buffer = new PacketBuffer(data.data, true)
			const flags = data.updateFlags
			const key = buffer.read(Types.UUID) as string
			const id = buffer.read(Types.U32) as number

			const insert = !region.objects.has(id)

			try {
				const entity = insert
					? this.update(new Entity(this.client, { id, key, flags }), buffer)
					: this.update(region.objects.get(id)!, buffer)

				entity.flags |= flags

				if (insert) {
					region.objects.set(id, entity)

					if (entity.type === 47) {
						region.agents.set(entity.key, new Agent(this.client, entity))
					}
				}

				if (entity.type === 47 && entity.key === this.client.self?.key) {
					this.client.self!.state = entity.state
					this.client.self!.position = entity.position!
					this.client.self!.rotation = entity.rotation!
				}
			} catch (error) {
				this.client.emit("debug", `Error updating object "${key}".`)
				this.client.emit("error", error as Error)
			}
		}
	}

	public update(entity: Entity, buffer: PacketBuffer) {
		let flags = Flags.NONE

		for (const [key, type] of compressedObjectProperties) {
			if (key === "parameters") {
				const count = buffer.read(Types.U8)

				// skip parameters for now
				// this just contains flex, light, mesh, and sculpt data
				for (let i = 0; i < count; i++) {
					buffer.skip(Types.U16.size)
					buffer.skip(buffer.read(Types.U32))
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
							entity.text = { value: value.slice(0, -1), color: [0, 0, 0, 0] }
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
}

export default ObjectUpdateCompressedDelegate

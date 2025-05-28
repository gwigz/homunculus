import assert from "node:assert"
import {
	type PacketBlock,
	PacketBuffer,
	PacketLookup,
	type PacketMetadata,
	type Type,
	U8,
} from "~/network"

export interface DeserializedPacket {
	data: Record<string, Record<string, any>>
	sequence: number
	reliable?: boolean
	metadata: PacketMetadata
}

/**
 * @link http://wiki.secondlife.com/wiki/Packet_Layout
 * @link http://wiki.secondlife.com/wiki/Message_Layout
 * @link http://wiki.secondlife.com/wiki/Pyogp/Client_Lib/Packet
 */
export class Deserializer {
	public read(buffer: Buffer) {
		return new PacketBuffer(buffer)
	}

	public lookup(buffer: PacketBuffer) {
		assert(buffer.id, "Invalid packet buffer")

		return PacketLookup.find(buffer.id)
	}

	public convert(metadata: PacketMetadata, buffer: PacketBuffer) {
		const data: Record<string, Record<string, any>> = {}

		// set position and uncompress blocks, if we need too
		buffer.prepare()

		// parse everything...
		if (metadata.blocks) {
			for (const block of metadata.blocks) {
				if (block.multiple) {
					const quantity = buffer.read(U8)

					data[block.name] = []

					for (let i = 0; i < quantity; i++) {
						data[block.name]!.push(this.readParameters(buffer, block))
					}
				} else {
					data[block.name] = this.readParameters(buffer, block)
				}
			}
		}

		return {
			data,
			sequence: buffer.sequence,
			...(buffer.reliable && { reliable: true }),
			metadata,
		} satisfies DeserializedPacket
	}

	private readParameters(buffer: PacketBuffer, format: PacketBlock) {
		const parameters: Record<string, Type> = {}

		for (const [name, Type] of format.parameters) {
			parameters[name] = buffer.read(Type)
		}

		return parameters
	}
}

import assert from "node:assert"
import { PacketBuffer, PacketLookup } from "~/network/helpers"
import type { Packet } from "./packets"
import * as Types from "./types"

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

	public convert(PacketConstructor: typeof Packet<any>, buffer: PacketBuffer) {
		const data: Record<string, Record<string, any>> = {}

		if (PacketConstructor.format === undefined) {
			return new PacketConstructor(data)
		}

		// set position and uncompress blocks, if we need too
		buffer.prepare()

		// parse everything...
		for (const [block, format] of PacketConstructor.format) {
			if (format.quantity === 1) {
				data[block] = this.readParameters(buffer, format)
			} else {
				const quantity = buffer.read(Types.U8)

				data[block] = []

				for (let i = 0; i < quantity; i++) {
					data[block].push(this.readParameters(buffer, format))
				}
			}
		}

		const packet: Packet<any> = new PacketConstructor(data)

		packet.index = buffer.sequence
		packet.reliable = buffer.reliable

		return packet
	}

	private readParameters(
		buffer: PacketBuffer,
		format: { parameters: Map<string, Types.Type> },
	) {
		const parameters: Record<string, Types.Type> = {}

		for (const [name, Type] of format.parameters) {
			parameters[name] = buffer.read(Type)
		}

		return parameters
	}
}

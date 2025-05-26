import assert from "node:assert"
import PacketBuffer from "./helpers/packet-buffer"
import PacketLookup from "./helpers/packet-lookup"
import type { Packet } from "./packets"
import * as Types from "./types"

/**
 * @link http://wiki.secondlife.com/wiki/Packet_Layout
 * @link http://wiki.secondlife.com/wiki/Message_Layout
 * @link http://wiki.secondlife.com/wiki/Pyogp/Client_Lib/Packet
 */
class Deserializer {
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
			const quantity = format.quantity ? format.quantity : buffer.read(Types.U8)

			data[block] = []

			// loop through block dependant on quantity value...
			for (let i = 0; i < quantity; i++) {
				const parameters: Record<string, Types.Type> = {}

				for (const [name, Type] of format.parameters) {
					parameters[name] = buffer.read(Type)
				}

				data[block].push(parameters)
			}
		}

		const packet: Packet<any> = new PacketConstructor(data)

		packet.index = buffer.sequence
		packet.reliable = buffer.reliable

		return packet
	}
}

export default Deserializer

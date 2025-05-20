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

	public convert(PacketConstructor: typeof Packet, buffer: PacketBuffer) {
		const packet: Packet = new PacketConstructor()

		packet.index = buffer.sequence
		packet.reliable = buffer.reliable

		if (PacketConstructor.format === undefined) {
			return packet
		}

		// set position and uncompress blocks, if we need too.
		buffer.prepare()

		// parse everything...
		for (const [block, format] of PacketConstructor.format) {
			const quantity = format.quantity ? format.quantity : buffer.read(Types.U8)

			packet.data[block] = []

			// loop through block dependant on quantity value...
			for (let i = 0; i < quantity; i++) {
				const parameters: Record<string, Types.Type> = {}

				for (const [name, Type] of format.parameters) {
					parameters[name] = buffer.read(Type)
				}

				packet.data[block].push(parameters)
			}
		}

		return packet
	}
}

export default Deserializer

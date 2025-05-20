// tslint:disable:no-shadowed-variable

import type { Packet } from "./packets"

import PacketBuffer from "./helpers/packet-buffer"
import PacketLookup from "./helpers/packet-lookup"

import * as Types from "./types"

/**
 * @link http://wiki.secondlife.com/wiki/Packet_Layout
 * @link http://wiki.secondlife.com/wiki/Message_Layout
 * @link http://wiki.secondlife.com/wiki/Pyogp/Client_Lib/Packet
 */
class Deserializer {
	public read(buffer): PacketBuffer {
		return new PacketBuffer(buffer)
	}

	public lookup(buffer: PacketBuffer): typeof Packet | null {
		return PacketLookup.find(buffer.id)
	}

	public convert(
		PacketConstructor: typeof Packet,
		buffer: PacketBuffer,
	): Packet {
		const packet: Packet = new PacketConstructor()

		packet.index = buffer.sequence
		packet.reliable = buffer.reliable

		if (PacketConstructor.format === undefined) {
			return packet
		}

		// Set position and uncompress blocks, if we need too.
		buffer.prepare()

		// Parse everythiiiing...
		for (const [block, format] of PacketConstructor.format) {
			const quantity = format.quantity ? format.quantity : buffer.read(Types.U8)

			packet.data[block] = []

			// Loop through block dependant on quantity value...
			for (let i = 0; i < quantity; i++) {
				const parameters = {}

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

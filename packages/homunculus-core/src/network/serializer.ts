import { Constants } from "../utilities"
import type Circuit from "./circuit"
import { Packet } from "./packets"
import { U8 } from "./types"

const MAX_INDEX = 0x01000000

class Serializer {
	public index = 0

	constructor(
		/** Circuit instance that instantiated this Serializer. */
		public readonly circuit: Circuit,
	) {}

	public convert(
		packet: Packet<any>,
		reliable?: boolean,
	): [buffer: Buffer, index: number] {
		if (!(packet instanceof Packet)) {
			throw new Error("Serializer is only able to convert instances of Packet.")
		}

		const PacketConstructor = packet.constructor as typeof Packet

		const index = this.index
		const array = [this.header(PacketConstructor, packet.reliable || reliable)]

		if (PacketConstructor.format) {
			// support skipping the block name in parameters
			if (PacketConstructor.format.size === 1) {
				const [block, format] = PacketConstructor.format.entries().next().value!

				// try and assume this correctly...
				if (!(block in packet.data) || Object.keys(packet.data).length > 1) {
					return [
						Buffer.concat(array.concat(this.parse(block, format, packet.data))),
						index,
					]
				}
			}

			for (const [block, format] of PacketConstructor.format) {
				if (!(block in packet.data)) {
					if (block === "agentData") {
						packet.data[block] = [{}]
					} else {
						throw new Error(Constants.Errors.MISSING_BLOCK.replace("%s", block))
					}
				}

				if (!Array.isArray(packet.data[block])) {
					packet.data[block] = [packet.data[block]]
				}

				const length = packet.data[block].length

				if (length > 255 || (format.quantity && length !== format.quantity)) {
					throw new Error(Constants.Errors.INVALID_BLOCK_QUANTITY)
				}

				if (!format.quantity) {
					// prefix with variable block quantity
					array.push(U8.toBuffer(length || 1))
				}

				for (const data of packet.data[block]) {
					array.push(this.parse(block, format, data))
				}
			}
		}

		return [Buffer.concat(array), index]
	}

	public header(PacketConstructor: typeof Packet, reliable?: boolean): Buffer {
		const index = this.index++

		if (index > MAX_INDEX) {
			this.index = 0
		}

		// first, append flags and packet sequence number/index
		// http://wiki.secondlife.com/wiki/Packet_Layout
		const array = [
			reliable ? 0x40 : 0x00, // flags
			index >> 24, // sequence number (1-4)
			index >> 16,
			index >> 8,
			index,
			0x00, // extra header padding
		]

		// logic for additional header bytes dependant on packet type/frequency
		if (PacketConstructor.frequency !== 2) {
			array.push(0xff)

			if (PacketConstructor.frequency !== 1) {
				array.push(0xff)
			}

			if (PacketConstructor.frequency === 0) {
				array.push((PacketConstructor.id >> 8) & 0xff)
			} else if (PacketConstructor.frequency === 3) {
				array.push(0xff)
			}
		}

		// append remaining section of the packet identifier
		array.push(PacketConstructor.id & 0xff)

		// pass buffer object
		return Buffer.from(array)
	}

	public parse(block: string, format: any, data: any = {}): Buffer {
		const array = []

		// attempt to fill optional parts of agent data blocks
		if (block === "agentData") {
			for (const [name] of format.parameters) {
				if (data[name] !== undefined) {
					continue
				}

				switch (name) {
					case "agentId":
						data.agentId = this.circuit.self.key
						break

					case "sessionId":
						data.sessionId = this.circuit.self.sessionId
						break

					case "circuitCode":
						data.circuitCode = this.circuit.id
						break

					case "estateId":
					case "flags":
					case "godLevel":
						data[name] = 0
						break

					case "godlike":
						data.godlike = false
						break

					default:
						throw new Error(
							Constants.Errors.MISSING_PARAMETER.replace("%s", name),
						)
				}
			}
		}

		for (const [name, Type] of format.parameters) {
			if (!(name in data)) {
				throw new Error(Constants.Errors.MISSING_PARAMETER.replace("%s", name))
			}

			array.push(Type.toBuffer(data[name]))
		}

		return Buffer.concat(array)
	}
}

export default Serializer

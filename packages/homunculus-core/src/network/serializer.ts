import { Constants } from "../utilities"
import type Circuit from "./circuit"
import { Packet } from "./packets"
import { U8 } from "./types"

class Serializer {
	public index: number

	constructor(
		/** Circuit instance that instantiated this Serializer. */
		public readonly circuit: Circuit,
	) {
		this.index = 1
	}

	public convert(packet: Packet): Buffer {
		if (!(packet instanceof Packet)) {
			throw new Error("Serializer is only able to convert instances of Packet.")
		}

		const PacketConstructor = packet.constructor as typeof Packet
		const array = [this.header(PacketConstructor)]

		if (PacketConstructor.format) {
			// support skipping the block name in parameters
			if (PacketConstructor.format.size === 1) {
				const [block, format] = PacketConstructor.format.entries().next().value!

				// try and assume this correctly...
				if (!(block in packet.data) || Object.keys(packet.data).length > 1) {
					return Buffer.concat(
						array.concat(this.parse(block, format, packet.data)),
					)
				}
			}

			for (const [block, format] of PacketConstructor.format) {
				if (!(block in packet.data)) {
					if (block === "agentData") {
						packet.data[block] = [{}]
					} else {
						throw new Error(Constants.Errors.MISSING_BLOCK)
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

		return Buffer.concat(array)
	}

	public header(PacketConstructor: typeof Packet): Buffer {
		const index = this.index++

		// first, append flags and packet sequence number/index
		// http://wiki.secondlife.com/wiki/Packet_Layout
		const array = [0x00, index >> 24, index >> 16, index >> 8, index, 0x00]

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

		// Attempt to fill optional parts of agent data blocks.
		if (block === "agentData") {
			for (const [name] of format.parameters) {
				if (name in data) {
					continue
				}

				switch (name) {
					case "agent":
						data.agent = this.circuit.self?.key
						break

					case "session":
						data.session = this.circuit.session
						break

					case "circuitCode":
						data.circuitCode = this.circuit.id
						break

					case "flags":
						data.flags = 0
						break

					case "estate":
						data.estate = 0
						break

					case "godlike":
						data.godlike = false
						break

					default:
						throw new Error(Constants.Errors.MISSING_PARAMETER)
				}
			}
		}

		for (const [name, Type] of format.parameters) {
			if (!(name in data)) {
				throw new Error(Constants.Errors.MISSING_PARAMETER)
			}

			array.push(Type.toBuffer(data[name]))
		}

		return Buffer.concat(array)
	}
}

export default Serializer

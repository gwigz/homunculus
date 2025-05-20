import { Constants } from "../utilities"
import { Packet } from "./packets"
import { U8 } from "./types"

import type Circuit from "./circuit"

class Serializer {
	public index: number
	public readonly circuit: Circuit

	constructor(circuit) {
		this.index = 1

		/**
		 * Circuit instance that instantiated this Seralizer.
		 *
		 * @name Seralizer#circuit
		 * @type {Circuit}
		 * @readonly
		 */
		Object.defineProperty(this, "circuit", { value: circuit })
	}

	public convert(packet: Packet): Buffer {
		if (!(packet instanceof Packet)) {
			throw new Error("Serializer is only able to convert instances of Packet.")
		}

		const PacketConstructor = packet.constructor as typeof Packet
		const array = [this.header(PacketConstructor)]

		if (PacketConstructor.format) {
			// Support skipping the block name in parameters.
			if (PacketConstructor.format.size === 1) {
				const [[block, format]] = PacketConstructor.format

				// Try and assume this correctly.
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
					// Prefix with variable block quantity.
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

		// First, append flags and packet sequence number/index.
		// http://wiki.secondlife.com/wiki/Packet_Layout
		const array = [0x00, index >> 24, index >> 16, index >> 8, index, 0x00]

		// Logic for additional header bytes dependant on packet type/frequency.
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

		// Append remaining section of the packet identifier.
		array.push(PacketConstructor.id & 0xff)

		// Pass buffer object.
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
						data.agent = this.circuit.agent.id
						break

					case "session":
						data.session = this.circuit.session
						break

					case "circuitCode":
						data.circuitCode = this.circuit.id
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

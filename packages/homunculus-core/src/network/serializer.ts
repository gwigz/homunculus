import assert from "node:assert"
import { Buffer } from "node:buffer"
import { Constants } from "~/utilities"
import type { Circuit } from "./circuit"
import type { Packet, PacketBlock, PacketMetadata } from "./packets"
import { U8 } from "./types"

const MAX_SEQUENCE = 0x01000000
const ACK_FLAG = 0x40

export class Serializer {
	public sequence = 1

	constructor(
		/** Circuit instance that instantiated this Serializer. */
		public readonly circuit: Circuit,
	) {}

	public convert(
		packet: Packet<any>,
		reliable?: boolean,
	): [data: Buffer, sequence: number] {
		const sequence = this.sequence
		const array = [this.header(packet.metadata, packet.reliable || reliable)]

		for (const block of packet.metadata.blocks ?? []) {
			if (!(block.name in packet.data)) {
				if (block.name === "agentData") {
					packet.data[block.name] = [{}]
				} else {
					throw new Error(
						Constants.Errors.MISSING_BLOCK.replace("%s", block.name),
					)
				}
			}

			if (!Array.isArray(packet.data[block.name])) {
				packet.data[block.name] = [packet.data[block.name]]
			}

			const length = packet.data[block.name].length

			assert.ok(
				length <= 255 && (block.multiple || length === 1),
				Constants.Errors.INVALID_BLOCK_QUANTITY,
			)

			if (block.multiple) {
				// prefix with variable block quantity
				array.push(U8.toBuffer(length || 1))
			}

			for (const data of packet.data[block.name]) {
				array.push(this.parse(block, data))
			}
		}

		return [Buffer.concat(array), sequence]
	}

	/**
	 * @see {@link http://wiki.secondlife.com/wiki/Packet_Layout}
	 */
	public header(metadata: PacketMetadata, reliable?: boolean) {
		const index = this.sequence++

		if (index > MAX_SEQUENCE) {
			this.sequence = 1
		}

		// first, append flags and packet sequence number/index
		const array = [
			reliable ? ACK_FLAG : 0, // flags
			index >> 24, // sequence number (1-4)
			index >> 16,
			index >> 8,
			index,
			0, // extra header padding (always 0 for now)
		]

		/**
		 *         [   header   ] [ msg num ] [ data ]
		 * High:   .. .. .. .. .. XX .. .. .. .. .. ..
		 * Medium: .. .. .. .. .. FF XX .. .. .. .. ..
		 * Low:    .. .. .. .. .. FF FF XX XX .. .. ..
		 * Fixed:  .. .. .. .. .. FF FF FF XX .. .. ..
		 */
		if (!metadata.frequency) {
			array.push(metadata.id & 0xff)
		} else if (metadata.frequency === 1) {
			array.push(0xff, metadata.id & 0xff)
		} else if (metadata.frequency === 2) {
			array.push(0xff, 0xff, (metadata.id >> 8) & 0xff, metadata.id & 0xff)
		} else {
			array.push(0xff, 0xff, 0xff, metadata.id & 0xff)
		}

		return Buffer.from(array) as Buffer
	}

	public parse(block: PacketBlock, data: any = {}): Buffer {
		const array = []

		// attempt to fill optional parts of agent data blocks
		if (block.name === "agentData") {
			for (const [name] of block.parameters) {
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

		for (const [name, Type] of block.parameters) {
			assert.ok(
				name in data,
				Constants.Errors.MISSING_PARAMETER.replace("%s", name),
			)

			array.push(Type.toBuffer(data[name]))
		}

		return Buffer.concat(array)
	}
}

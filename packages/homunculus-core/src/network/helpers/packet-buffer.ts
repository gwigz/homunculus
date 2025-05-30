import assert from "node:assert"
import { Buffer } from "node:buffer"
import {
	Color4,
	F32,
	Quaternion,
	Text,
	type Type,
	Variable1,
	Variable2,
	Vector3,
} from "~/network"

/**
 * @link http://wiki.secondlife.com/wiki/Packet_Layout
 */
export class PacketBuffer {
	public readonly id?: number
	public readonly frequency?: number

	private buffer: Buffer
	private position = 0

	constructor(buffer: Buffer, delegating = false) {
		this.buffer = buffer

		if (delegating) {
			this.position = 0

			// skip parsing packet header if we are just want to use this for a
			// buffer, may move the stuff below into a similar method like prepare
			return
		}

		if (this.buffer.length < 7) {
			return
		}

		const header = this.zerocoded
			? ([] as number[])
			: this.buffer.subarray(6, Math.min(this.buffer.length, 12))

		const offset = Math.min(this.buffer.length, 12)

		if (Array.isArray(header)) {
			for (let i = 6; i < offset; i++) {
				if (this.buffer[i] === 0x00) {
					// handle zero-coding: expand the next byte as a run-length count of zeros
					header.push(...new Uint8Array(this.buffer.readUInt8(++i)))
				} else {
					header.push(this.buffer[i] ?? 0)
				}
			}
		}

		// Determine the frequency and message ID based on the header
		if (header[0] !== 0xff) {
			// high frequency (frequency = 0)
			this.id = header[0]
			this.frequency = 0
		} else if (header[1] !== 0xff) {
			// medium frequency (frequency = 1)
			this.id = header[1]
			this.frequency = 1
		} else if (header[2] !== 0xff) {
			// low frequency (frequency = 2)
			this.id = (header[2]! << 8) | (header[3] ?? 0)
			this.frequency = 2
		} else {
			// fixed frequency (frequency = 3)
			this.id =
				((header[0] << 24) >>> 0) +
				((header[1] << 16) >>> 0) +
				((header[2] << 8) >>> 0) +
				(header[3] ?? 0)

			this.frequency = 3
		}
	}

	public prepare() {
		if (this.zerocoded) {
			this.dezerocode()
		}

		if (!this.frequency) {
			// high frequency
			this.position = this.buffer.readUInt8(5) + 7
		} else if (this.frequency === 1) {
			// low frequency
			// medium frequency
			this.position = this.buffer.readUInt8(5) + 8
		} else {
			// low and fixed frequency
			this.position = this.buffer.readUInt8(5) + 10
		}

		return this
	}

	get length() {
		return this.buffer.length
	}

	get sequence() {
		return (
			((this.buffer[1] ?? 0) << 24) |
			((this.buffer[2] ?? 0) << 16) |
			((this.buffer[3] ?? 0) << 8) |
			(this.buffer[4] ?? 0)
		)
	}

	get acks() {
		return !!((this.buffer[0] ?? 0) & 0x10)
	}

	get resent() {
		return !!((this.buffer[0] ?? 0) & 0x20)
	}

	get reliable() {
		return !!((this.buffer[0] ?? 0) & 0x40)
	}

	get zerocoded() {
		return !!((this.buffer[0] ?? 0) & 0x80)
	}

	public dezerocode() {
		const output = [...this.buffer.subarray(0, 6)]

		let end = this.length

		// acks are not zero-coded, so we can skip them
		if (this.acks) {
			const acks = this.buffer.readUInt8(this.buffer.length - 1)

			if (acks > 0) {
				end = this.buffer.length - (acks * 4 + 1)
			}

			assert.ok(end >= 7, "Invalid packet")
		}

		for (let i = 6; i < end; i++) {
			if (this.buffer[i] === 0x00) {
				output.push(...new Uint8Array(this.buffer.readUInt8(++i)))
			} else {
				output.push(this.buffer[i] ?? 0)
			}
		}

		this.buffer = Buffer.from(output)
	}

	public read(type: Type, ...args: any[]) {
		const output = this.fetch(type, ...args)

		switch (type) {
			case Variable1:
				this.position += this.buffer.readUInt8(this.position) + 1
				break

			case Variable2:
				this.position += this.buffer.readUInt16LE(this.position) + 2
				break

			case Text:
				this.position += output.length + 1
				break

			case Quaternion:
				if (args.length > 1) {
					this.position += args[1].size * 4

					// If normalized, take one step away from the position we just added.
					if (args[0]) {
						this.position -= args[1].size
					}
				} else if (args.length) {
					// If normalized, default to standard size.
					this.position += Quaternion.size
				} else {
					// If not, add one to default size.
					this.position += Quaternion.size + F32.size
				}
				break

			case Vector3:
				if (args.length) {
					this.position += args[0].size * 3
				} else {
					this.position += Vector3.size
				}
				break

			case Color4:
				this.position += Color4.size
				break

			default:
				assert.ok(
					type && "size" in type && typeof type.size === "number",
					"Invalid type",
				)

				this.position += type.size
				break
		}

		return output
	}

	public skip(bytes: number) {
		this.position += bytes
	}

	public fetch(type: Type, ...args: any[]) {
		assert.ok(
			type && "fromBuffer" in type && typeof type.fromBuffer === "function",
			"Invalid type",
		)

		return type.fromBuffer(this.buffer, this.position, ...args)
	}

	public acknowledgements() {
		if (!this.acks) {
			return []
		}

		const acks = []
		const length = this.buffer.readUInt8(this.buffer.length - 1)
		const start = this.buffer.length - (length * 4 + 1)

		for (let i = 0; i < length; i++) {
			acks.push(this.buffer.readUInt32LE(start - (i * 4 + 1)))
		}

		return acks
	}
}

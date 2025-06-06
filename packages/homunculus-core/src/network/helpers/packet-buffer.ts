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

const FREQUENCY_OFFSETS = [1, 2, 4, 4] as const

/**
 * @link http://wiki.secondlife.com/wiki/Packet_Layout
 */
export class PacketBuffer {
	public readonly id?: number
	public readonly frequency?: 0 | 1 | 2 | 3

	private buffer: Buffer
	private position = 0

	constructor(buffer: Buffer, delegating = false) {
		this.buffer = buffer

		// TODO: separate this into a different class
		if (delegating) {
			this.position = 0
			return
		}

		if (this.buffer.length < 7) {
			return
		}

		// the 5th byte is extra header bytes, which we need to skip
		const start = 6 + this.buffer.readUInt8(5)

		const id = this.zerocoded
			? Buffer.alloc(4)
			: this.buffer.subarray(start, start + 4)

		// the message ID can be zero-coded, in that case, we need to parse it
		if (this.zerocoded) {
			const length = this.buffer.length

			let read = start
			let write = 0

			while (write < 4 && read < length) {
				const byte = this.buffer[read]

				if (byte === 0) {
					const zeros = Math.min(this.buffer[read + 1] || 0, 4 - write)

					id.fill(0, write, write + zeros)
					write += zeros
					read += 2
				} else {
					id[write++] = byte!
					read++
				}
			}
		}

		this.frequency = 0

		while (this.frequency < 3 && id[this.frequency] === 0xff) {
			this.frequency++
		}

		this.position = start + FREQUENCY_OFFSETS[this.frequency]!

		if (this.frequency === 0) {
			this.id = id[0]
		} else if (this.frequency === 1) {
			this.id = id[1]
		} else if (this.frequency === 2) {
			this.id = (id[2]! << 8) | (id[3] ?? 0)
		} else {
			this.id =
				((id[0]! << 24) >>> 0) +
				((id[1]! << 16) >>> 0) +
				((id[2]! << 8) >>> 0) +
				(id[3] ?? 0)
		}
	}

	public prepare() {
		if (this.zerocoded) {
			this.dezerocode()
		}
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
		assert(this.zerocoded, "Packet is not zero-coded")

		// skip header
		const start = 6

		// skip acks (they're not zero-coded)
		const end = this.length - 1
		const tail = this.acks ? this.buffer.readUInt8(end) * 4 + 1 : 0
		const cap = end - tail

		let size = 0
		let zero = false
		let position = start

		for (let index = start; index <= end; index++) {
			if (zero) {
				zero = false
				size += this.buffer.readUInt8(index)
			} else if (this.buffer[index] === 0 && index <= cap) {
				zero = true
			}
		}

		zero = false

		const buffer = Buffer.allocUnsafe(end + 1 + size)

		// copy header
		this.buffer.copy(buffer, 0, 0, start - 1)

		// copy body, with fill for zero-coded bytes
		for (let index = start; index <= end; index++) {
			if (zero) {
				zero = false

				const count = this.buffer.readUInt8(index)

				buffer.fill(0, position, position + count)
				position += count
			} else if (this.buffer[index] === 0 && index <= cap) {
				zero = true
			} else {
				buffer[position++] = this.buffer[index]!
			}
		}

		// set the header to non-zero-coded
		buffer[0] = this.buffer[0]! & ~0x80

		this.buffer = buffer
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

		const length = this.buffer.readUInt8(this.buffer.length - 1)
		const start = this.buffer.length - (length * 4 + 1)

		return Array.from({ length }, (_, i) =>
			this.buffer.readUInt32BE(start + i * 4),
		)
	}
}

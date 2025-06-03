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
	public readonly frequency?: 0 | 1 | 2 | 3

	private buffer: Buffer
	private position = 0

	constructor(buffer: Buffer, delegating = false) {
		this.buffer = buffer

		if (delegating) {
			this.position = 0
			return
		}

		if (this.buffer.length < 7) {
			return
		}

		// determine the frequency
		if (this.buffer[6] !== 0xff) {
			// high frequency (frequency = 0)
			this.id = this.buffer[6]
			this.frequency = 0
		} else if (this.buffer[7] !== 0xff) {
			// medium frequency (frequency = 1)
			this.id = this.buffer[7]
			this.frequency = 1
		} else if (this.buffer[8] !== 0xff) {
			// low frequency (frequency = 2)
			this.id = (this.buffer[8]! << 8) | (this.buffer[9] ?? 0)
			this.frequency = 2
		} else {
			// fixed frequency (frequency = 3)
			this.id =
				((this.buffer[6] << 24) >>> 0) +
				((this.buffer[7] << 16) >>> 0) +
				((this.buffer[8] << 8) >>> 0) +
				(this.buffer[9] ?? 0)

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

		// set the header to non-zero-coded
		buffer[0] = this.buffer[0]! & ~0x80

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

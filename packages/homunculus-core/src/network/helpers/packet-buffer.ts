import assert from "node:assert"
import * as Types from "../types"

/**
 * @link http://wiki.secondlife.com/wiki/Packet_Layout
 */
class PacketBuffer {
	public readonly id?: number
	public readonly frequency?: number

	private buffer: Buffer
	private position = 0

	constructor(buffer: Buffer, delegating = false) {
		this.buffer = buffer

		if (delegating) {
			this.position = 0

			// Skip parsing packet header if we are just want to use this for a
			// buffer, may move the stuff below into a similar method like prepare.
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
					header.push(...new Uint8Array(this.buffer.readUInt8(++i)))
				} else {
					header.push(this.buffer[i] ?? 0)
				}
			}
		}

		if (header[0] !== 0xff) {
			this.id = Number(`${header[0]}2`)
			this.frequency = 2
		} else if (header[1] !== 0xff) {
			this.id = Number(`${header[1]}1`)
			this.frequency = 1
		} else if (header[2] !== 0xff) {
			this.id = Number(`${(header[2]! << 8) + (header[3] ?? 0)}0`)
			this.frequency = 0
		} else {
			this.id = Number(`${header[3]}3`)
			this.frequency = 3
		}
	}

	public prepare() {
		if (this.zerocoded) {
			this.dezerocode()
		}

		switch (this.frequency) {
			case 3:
			case 0:
				this.position = this.buffer.readUInt8(5) + 10
				break

			case 1:
				this.position = this.buffer.readUInt8(5) + 8
				break

			case 2:
				this.position = this.buffer.readUInt8(5) + 7
				break
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
		const length = this.length

		for (let i = 6; i < length; i++) {
			if (this.buffer[i] === 0x00) {
				output.push(...new Uint8Array(this.buffer.readUInt8(++i)))
			} else {
				output.push(this.buffer[i] ?? 0)
			}
		}

		this.buffer = Buffer.from(output)
	}

	public read(type: Types.Type, ...args: any[]) {
		const output = this.fetch(type, ...args)

		switch (type) {
			case Types.Variable1:
				this.position += this.buffer.readUInt8(this.position) + 1
				break

			case Types.Variable2:
				this.position += this.buffer.readUInt16LE(this.position) + 2
				break

			case Types.Text:
				this.position += output.length + 1
				break

			case Types.Quaternion:
				if (args.length > 1) {
					this.position += args[1].size * output.length

					// If normalized, take one step away from the position we just added.
					if (args[0]) {
						this.position -= args[1].size
					}
				} else if (args.length) {
					// If normalized, default to standard size.
					this.position += Types.Quaternion.size
				} else {
					// If not, add one to default size.
					this.position += Types.Quaternion.size + Types.F32.size
				}
				break

			case Types.Vector3:
				if (args.length) {
					this.position += args[0].size * output.length
				} else {
					this.position += Types.Vector3.size
				}
				break

			default:
				assert(
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

	public fetch(type: Types.Type, ...args: any[]) {
		assert(
			type && "fromBuffer" in type && typeof type.fromBuffer === "function",
			"Invalid type",
		)

		return type.fromBuffer(this.buffer, this.position, ...args)
	}
}

export default PacketBuffer

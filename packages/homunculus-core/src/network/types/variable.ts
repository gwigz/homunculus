import assert from "node:assert"
import { Buffer } from "node:buffer"

class Variable {
	/**
	 * Converts a string to a buffer prefixed by length.
	 *
	 * @param size Prefix size
	 * @param value Input value
	 */
	public static toPrefixedBuffer(size: number, value: string | Buffer) {
		const max = 256 * (size * 8)

		const buffer =
			typeof value === "string" ? Buffer.from(value, "utf-8") : value

		const length = Math.min(max, buffer.length)
		const prefix = Buffer.allocUnsafe(size)

		if (size === 1) {
			prefix.writeUInt8(length, 0)
		} else if (size === 2) {
			prefix.writeUInt16LE(length, 0)
		} else {
			assert.ok(size === 1 || size === 2, "Invalid size")
		}

		return Buffer.concat([prefix, buffer.subarray(0, length)])
	}

	/**
	 * Converts to correct length buffer.
	 *
	 * @param size Prefix size
	 * @param buffer Buffer to convert
	 * @param start Position to read from
	 */
	public static fromPrefixedBuffer(
		size: number,
		buffer: Buffer,
		start: number,
	) {
		const length =
			size === 1 ? buffer.readUInt8(start) : buffer.readUInt16LE(start)

		// may want to use slice instead here, so the delegates can handle whatever
		// this value contains
		return buffer.subarray(start + size, start + length + size)
	}
}

export default Variable

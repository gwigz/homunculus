import { Buffer } from "node:buffer"

class S8 {
	public static readonly size = 1

	private static readonly MIN_VALUE = -128
	private static readonly MAX_VALUE = 127

	/**
	 * Converts integer input into a buffer representing an 8-bit signed integer.
	 *
	 * @param integer Integer to convert
	 * @returns {Buffer}
	 */
	public static toBuffer(integer: number): Buffer {
		const buffer = Buffer.allocUnsafe(S8.size)

		if (integer > S8.MAX_VALUE) {
			buffer.writeInt8(S8.MIN_VALUE, 0)
		} else if (integer < S8.MIN_VALUE) {
			buffer.writeInt8(S8.MAX_VALUE, 0)
		} else {
			buffer.writeInt8(integer, 0)
		}

		return buffer
	}

	/**
	 * Converts buffer input into an integer which was representing an 8-bit
	 * signed integer.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 * @returns {number}
	 */
	public static fromBuffer(buffer: Buffer, position = 0): number {
		return buffer.readInt8(position)
	}
}

export default S8

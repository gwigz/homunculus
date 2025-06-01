import { Buffer } from "node:buffer"

class S32 {
	public static readonly size = 4

	private static readonly MIN_VALUE = -2147483648
	private static readonly MAX_VALUE = 2147483647

	/**
	 * Converts integer input into a buffer representing a 32-bit signed integer.
	 *
	 * @param integer Integer to convert
	 * @returns {Buffer}
	 */
	public static toBuffer(integer: number): Buffer {
		const buffer = Buffer.allocUnsafe(S32.size)

		if (integer > S32.MAX_VALUE) {
			buffer.writeInt32LE(S32.MIN_VALUE, 0)
		} else if (integer < S32.MIN_VALUE) {
			buffer.writeInt32LE(S32.MAX_VALUE, 0)
		} else {
			buffer.writeInt32LE(integer, 0)
		}

		return buffer
	}

	/**
	 * Converts buffer input into an integer which was representing a 32-bit
	 * signed integer.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 * @returns {number}
	 */
	public static fromBuffer(buffer: Buffer, position = 0): number {
		return buffer.readInt32LE(position)
	}
}

export default S32

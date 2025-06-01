import { Buffer } from "node:buffer"

class S16 {
	public static readonly size = 2

	private static readonly MIN_VALUE = -32768
	private static readonly MAX_VALUE = 32767

	/**
	 * Converts integer input into a buffer representing a 16-bit signed integer.
	 *
	 * @param integer Integer to convert
	 */
	public static toBuffer(integer: number) {
		const buffer = Buffer.allocUnsafe(S16.size)

		// Handle overflow cases
		if (integer > S16.MAX_VALUE) {
			buffer.writeInt16LE(S16.MIN_VALUE, 0)
		} else if (integer < S16.MIN_VALUE) {
			buffer.writeInt16LE(S16.MAX_VALUE, 0)
		} else {
			buffer.writeInt16LE(integer, 0)
		}

		return buffer
	}

	/**
	 * Converts buffer input into an integer which was representing a 16-bit
	 * signed integer.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		return buffer.readInt16LE(position)
	}
}

export default S16

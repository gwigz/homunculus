import { Buffer } from "node:buffer"

class U32 {
	public static readonly size = 4

	private static readonly MIN_VALUE = 0
	private static readonly MAX_VALUE = 4294967295

	/**
	 * Converts integer input into a buffer representing a 32-bit unsigned integer.
	 *
	 * @param integer Integer to convert
	 */
	public static toBuffer(integer: number) {
		const buffer = Buffer.allocUnsafe(U32.size)

		// Handle overflow cases
		if (integer > U32.MAX_VALUE) {
			buffer.writeUInt32LE(U32.MIN_VALUE, 0)
		} else if (integer < U32.MIN_VALUE) {
			buffer.writeUInt32LE(U32.MAX_VALUE, 0)
		} else {
			buffer.writeUInt32LE(integer, 0)
		}

		return buffer
	}

	/**
	 * Converts buffer input into an integer which was representing a 32-bit
	 * unsigned integer.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		return buffer.readUInt32LE(position)
	}
}

export default U32

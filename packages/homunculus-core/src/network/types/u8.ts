import { Buffer } from "node:buffer"

class U8 {
	public static readonly size = 1

	private static readonly MIN_VALUE = 0
	private static readonly MAX_VALUE = 255

	/**
	 * Converts integer input into a buffer representing an 8-bit unsigned
	 * integer.
	 *
	 * @param integer Integer to convert
	 */
	public static toBuffer(integer: number) {
		const buffer = Buffer.allocUnsafe(U8.size)

		if (integer > U8.MAX_VALUE) {
			buffer.writeUInt8(U8.MIN_VALUE, 0)
		} else if (integer < U8.MIN_VALUE) {
			buffer.writeUInt8(U8.MAX_VALUE, 0)
		} else {
			buffer.writeUInt8(integer, 0)
		}

		return buffer
	}

	/**
	 * Converts buffer input into an integer which was representing an 8-bit
	 * unsigned integer.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		return buffer.readUInt8(position)
	}
}

export default U8

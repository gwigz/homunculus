import { Buffer } from "node:buffer"

class S8 {
	public static readonly size: number = 1

	/**
	 * Converts integer input into a buffer representing an 8-bit signed integer.
	 *
	 * @param integer Integer to convert
	 * @returns {Buffer}
	 */
	public static toBuffer(integer: number): Buffer {
		const buffer = Buffer.allocUnsafe(S8.size)

		buffer.writeInt8(integer, 0)

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

import { Buffer } from "node:buffer"

class U8 {
	public static readonly size: number = 1

	/**
	 * Converts integer input into a buffer representing an 8-bit unsigned
	 * integer.
	 *
	 * @param integer Integer to convert
	 * @returns {Buffer}
	 */
	public static toBuffer(integer: number): Buffer {
		const buffer = Buffer.allocUnsafe(U8.size)

		buffer.writeUInt8(integer, 0)

		return buffer
	}

	/**
	 * Converts buffer input into an integer which was representing an 8-bit
	 * unsigned integer.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 * @returns {number}
	 */
	public static fromBuffer(buffer: Buffer, position = 0): number {
		return buffer.readUInt8(position)
	}
}

export default U8

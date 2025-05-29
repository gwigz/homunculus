import { Buffer } from "node:buffer"

class F32 {
	public static readonly size: number = 4

	/**
	 * Converts number input into a buffer representing an 32-bit float.
	 *
	 * @param float Number/float to convert
	 * @returns {Buffer}
	 */
	public static toBuffer(float: number): Buffer {
		const buffer = Buffer.allocUnsafe(F32.size)

		buffer.writeFloatLE(float, 0)

		return buffer
	}

	/**
	 * Converts buffer input into an number which was representing an 32-bit
	 * float.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 * @returns {number}
	 */
	public static fromBuffer(buffer: Buffer, position = 0): number {
		return buffer.readFloatLE(position)
	}
}

export default F32

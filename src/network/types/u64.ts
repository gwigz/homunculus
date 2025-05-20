import Long from "long"

class U64 {
	public static readonly size: number = 8

	/**
	 * Converts Long input into a buffer representing an 64-bit unsigned integer.
	 *
	 * @param {number|Long} integer Integer to convert
	 * @returns {Buffer}
	 */
	public static toBuffer(integer: number | Long): Buffer {
		const buffer = Buffer.allocUnsafe(U64.size)

		const value =
			integer instanceof Long ? integer : Long.fromNumber(integer, true)

		buffer.writeInt32LE(value.low, 0)
		buffer.writeInt32LE(value.high, 4)

		return buffer
	}

	/**
	 * Converts buffer input into a Long which was representing an 64-bit unsigned
	 * integer.
	 *
	 * @param {Buffer} buffer Buffer to convert
	 * @param {number} position Position to read from
	 * @returns {Long}
	 */
	public static fromBuffer(buffer: Buffer, position = 0): Long {
		return Long.fromBits(
			buffer.readInt32LE(position),
			buffer.readInt32LE(position + 4),
			true,
		)
	}
}

export default U64

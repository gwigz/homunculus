const ONE_OVER_U16_MAX = 1.0 / 65535

class U16 {
	public static size = 2

	/**
	 * Converts integer input into a buffer representing an 16-bit unsigned
	 * integer.
	 *
	 * @param {number} integer Integer to convert
	 * @returns {Buffer}
	 */
	public static toBuffer(integer: number): Buffer {
		const buffer = Buffer.allocUnsafe(U16.size)

		buffer.writeUInt16LE(integer, 0)

		return buffer
	}

	/**
	 * Converts buffer input into an integer which was representing an 16-bit
	 * unsigned integer.
	 *
	 * @param {Buffer} buffer Buffer to convert
	 * @param {number} position Position to read from
	 * @returns {number}
	 */
	public static fromBuffer(buffer: Buffer, position = 0): number {
		return buffer.readUInt16LE(position)
	}

	/**
	 * Converts a 16-bit unsigned integer to a floating point number, to a certain
	 * degree of accuracy.
	 *
	 * @param {number} value U16 wide number to convert
	 * @param {number} lower Lower limit for conversion
	 * @param {number} upper Upper limit for conversion
	 * @returns {number} Float value, will return 0.0 if delta is reached
	 */
	public static toFloat(value: number, lower: number, upper: number): number {
		const float = value * ONE_OVER_U16_MAX

		if (Math.abs(float) < (upper - lower) * ONE_OVER_U16_MAX) {
			return 0.0
		}

		return float
	}
}

export default U16

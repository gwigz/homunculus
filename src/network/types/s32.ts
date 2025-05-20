class S16 {
	public static readonly size: number = 4

	/**
	 * Converts integer input into a buffer representing an 32-bit signed integer.
	 *
	 * @param {number} integer Integer to convert
	 * @returns {Buffer}
	 */
	public static toBuffer(integer: number): Buffer {
		const buffer = Buffer.allocUnsafe(S16.size)

		buffer.writeInt32LE(integer, 0)

		return buffer
	}

	/**
	 * Converts buffer input into an integer which was representing an 32-bit
	 * signed integer.
	 *
	 * @param {Buffer} buffer Buffer to convert
	 * @param {number} position Position to read from
	 * @returns {number}
	 */
	public static fromBuffer(buffer: Buffer, position = 0): number {
		return buffer.readInt32LE(position)
	}
}

export default S16

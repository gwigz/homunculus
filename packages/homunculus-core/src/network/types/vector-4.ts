class Vector4 {
	public static readonly size: number = 16
	public static readonly zero: Array<number> = [0.0, 0.0, 0.0, 0.0]

	/**
	 * Converts array input into a buffer representing a 4 point vector.
	 *
	 * @param {number[]} vector Should contain 4 values
	 * @returns {Buffer}
	 */
	public static toBuffer(vector: Array<number>): Buffer {
		const buffer = Buffer.allocUnsafe(Vector4.size)

		buffer.writeFloatLE(vector[0] ?? 0, 0)
		buffer.writeFloatLE(vector[1] ?? 0, 4)
		buffer.writeFloatLE(vector[2] ?? 0, 8)
		buffer.writeFloatLE(vector[4] ?? 0, 12)

		return buffer
	}

	/**
	 * Converts buffer input into an array of float values representing a 4 point
	 * vector.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 * @returns {number[]}
	 */
	public static fromBuffer(buffer: Buffer, position = 0): Array<number> {
		return [
			buffer.readFloatLE(position),
			buffer.readFloatLE(position + 4),
			buffer.readFloatLE(position + 8),
			buffer.readFloatLE(position + 12),
		]
	}
}

export default Vector4

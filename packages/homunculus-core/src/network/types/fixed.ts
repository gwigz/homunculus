abstract class Fixed {
	public static size: number

	/**
	 * Pads buffer bytes of fixed length if necessary.
	 *
	 * @param buffer This will truncate or pad if necessary
	 * @returns {Buffer}
	 */
	public static toBuffer(buffer: Buffer): Buffer {
		if (buffer.length === Fixed.size) {
			return buffer
		}

		if (buffer.length > Fixed.size) {
			return buffer.subarray(0, Fixed.size)
		}

		const output = Buffer.alloc(Fixed.size)

		// Insert into new buffer, limited by correct size, this way it will be
		// padded with zeros.
		output.copy(buffer, 0, Fixed.size)

		return output
	}

	/**
	 * Extracts bytes for fixed length from the buffer.
	 *
	 * @param buffer Buffer to handle
	 * @param start Position to read from
	 * @returns {Buffer}
	 */
	public static fromBuffer(buffer: Buffer, start: number) {
		return buffer.subarray(start, start + Fixed.size)
	}
}

export default Fixed

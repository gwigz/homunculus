class Text {
	/**
	 * Converts buffer input into an a subsection of the buffer, from position
	 * till the next null/zero byte terminator.
	 *
	 * @param {Buffer} buffer Buffer to convert
	 * @param {number} position Position to read from
	 * @returns {Buffer}
	 */
	public static fromBuffer(buffer: Buffer, position = 0): Buffer {
		const bytes = []

		for (const byte of buffer.slice(position)) {
			if (byte === 0x00) {
				break
			}

			bytes.push(byte)
		}

		return Buffer.from(bytes)
	}
}

export default Text

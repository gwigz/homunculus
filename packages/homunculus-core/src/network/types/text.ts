class Text {
	/**
	 * Converts buffer input into an a subsection of the buffer, from position
	 * till the next null/zero byte.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		const bytes = []

		for (const byte of buffer.subarray(position)) {
			if (byte === 0x00) {
				break
			}

			bytes.push(byte)
		}

		return Buffer.from(bytes)
	}
}

export default Text

class Variable {
	/**
	 * Converts a string to a buffer prefixed by length.
	 *
	 * @param {number} size Prefix size
	 * @param {string|Buffer} value Input value
	 * @returns {buffer}
	 */
	public static toPrefixedBuffer(size: number, value: string | Buffer): Buffer {
		const max = 256 * (size * 8)

		const buffer =
			typeof value === "string" ? Buffer.from(value, "utf-8") : value

		const length = Math.min(max, buffer.length)
		const prefix = Buffer.allocUnsafe(size)

		switch (size) {
			case 1:
				prefix.writeUInt8(length, 0)
				break

			case 2:
				prefix.writeUInt16LE(length, 0)
				break
		}

		return Buffer.concat([prefix, buffer.slice(0, length)])
	}

	/**
	 * Converts to correct length buffer.
	 *
	 * @param {number} size Prefix size
	 * @param {Buffer} buffer Buffer to convert
	 * @param {number} start Position to read from
	 * @returns {Buffer}
	 */
	public static fromPrefixedBuffer(
		size: number,
		buffer: Buffer,
		start: number,
	): Buffer {
		const length =
			size === 1 ? buffer.readUInt8(start) : buffer.readUInt16LE(start)

		// May want to use slice instead here, so the delegates can handle whatever
		// this value contains.
		return buffer.slice(start + size, start + length + size)
	}
}

export default Variable

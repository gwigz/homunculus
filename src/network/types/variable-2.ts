import Variable from "./variable"

class Variable2 extends Variable {
	public static readonly prefix: number = 2

	/**
	 * Converts string into a length-prefixed buffer, ending with a null
	 * terminater.
	 *
	 * @param {string} string Maximum length of 65535 bytes, may truncate
	 * @returns {Buffer}
	 */
	public static toBuffer(string: string): Buffer {
		return Variable2.toPrefixedBuffer(Variable2.prefix, string)
	}

	/**
	 * Converts to correct length buffer.
	 *
	 * @param {Buffer} buffer Buffer to convert
	 * @param {number} start Position to read from
	 * @returns {Buffer}
	 */
	public static fromBuffer(buffer: Buffer, start: number): Buffer {
		return Variable2.fromPrefixedBuffer(Variable2.prefix, buffer, start)
	}
}

export default Variable2

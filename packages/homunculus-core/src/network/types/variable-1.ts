import Variable from "./variable"

class Variable1 extends Variable {
	public static readonly prefix: number = 1

	/**
	 * Converts string into a length-prefixed buffer, ending with a null
	 * byte.
	 *
	 * @param {string|Buffer} Maximum length of 255 bytes, may truncate
	 * @returns {Buffer}
	 */
	public static toBuffer(string: string): Buffer {
		return Variable1.toPrefixedBuffer(Variable1.prefix, string)
	}

	/**
	 * Converts buffer input into a correct length buffer.
	 *
	 * @param buffer Buffer to convert
	 * @param start Position to read from
	 * @returns {Buffer}
	 */
	public static fromBuffer(buffer: Buffer, start?: number): Buffer {
		return Variable1.fromPrefixedBuffer(Variable1.prefix, buffer, start ?? 0)
	}
}

export default Variable1

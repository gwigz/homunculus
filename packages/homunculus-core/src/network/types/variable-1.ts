import Variable from "./variable"

class Variable1 extends Variable {
	public static readonly prefix = 1

	/**
	 * Converts string into a length-prefixed buffer, ending with a null
	 * byte.
	 *
	 * @param string Maximum length of 255 bytes, may truncate
	 */
	public static toBuffer(string: string) {
		return Variable1.toPrefixedBuffer(Variable1.prefix, string)
	}

	/**
	 * Converts buffer input into a correct length buffer.
	 *
	 * @param buffer Buffer to convert
	 * @param start Position to read from
	 */
	public static fromBuffer(buffer: Buffer, start?: number) {
		return Variable1.fromPrefixedBuffer(Variable1.prefix, buffer, start ?? 0)
	}
}

export default Variable1

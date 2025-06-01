import Variable from "./variable"

class Variable2 extends Variable {
	public static readonly prefix = 2

	/**
	 * Converts string into a length-prefixed buffer, ending with a null
	 * byte.
	 *
	 * @param string Maximum length of 65535 bytes, may truncate
	 */
	public static toBuffer(string: string) {
		return Variable2.toPrefixedBuffer(Variable2.prefix, string)
	}

	/**
	 * Converts to correct length buffer.
	 *
	 * @param buffer Buffer to convert
	 * @param start Position to read from
	 */
	public static fromBuffer(buffer: Buffer, start: number) {
		return Variable2.fromPrefixedBuffer(Variable2.prefix, buffer, start)
	}
}

export default Variable2

import { Buffer } from "node:buffer"

class Bool {
	public static readonly size: number = 1

	/**
	 * Converts boolean input into a buffer representing an 8-bit unsigned
	 * boolean.
	 *
	 * @param bool Boolean to convert
	 */
	public static toBuffer(bool: boolean | number) {
		const buffer = Buffer.allocUnsafe(Bool.size)

		buffer.writeUInt8(Number(!!bool), 0)

		return buffer
	}

	/**
	 * Converts buffer input into an boolean which was representing an 8-bit
	 * unsigned boolean.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		return !!buffer.readUInt8(position)
	}
}

export default Bool

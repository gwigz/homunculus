import { Buffer } from "node:buffer"

const ONE_OVER_U16_MAX = 1.0 / 65535

class U16 {
	public static size = 2

	/**
	 * Converts integer input into a buffer representing an 16-bit unsigned
	 * integer.
	 *
	 * @param integer Integer to convert.
	 */
	public static toBuffer(integer: number) {
		const buffer = Buffer.allocUnsafe(U16.size)

		buffer.writeUInt16LE(integer, 0)

		return buffer
	}

	/**
	 * Converts buffer input into an integer which was representing an 16-bit
	 * unsigned integer.
	 *
	 * @param buffer Buffer to convert.
	 * @param position Position to read from.
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		return buffer.readUInt16LE(position)
	}

	/**
	 * Converts a 16-bit unsigned integer to a floating point number, to a certain
	 * degree of accuracy.
	 *
	 * @param value U16 wide number to convert.
	 * @param lower Lower limit for conversion.
	 * @param upper Upper limit for conversion.
	 * @returns Float value mapped to the target range.
	 */
	public static toFloat(value: number, lower: number, upper: number) {
		const normalized = value * ONE_OVER_U16_MAX

		return lower + normalized * (upper - lower)
	}
}

export default U16

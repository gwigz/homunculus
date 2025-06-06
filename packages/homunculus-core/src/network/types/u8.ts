import { Buffer } from "node:buffer"

const ONE_OVER_U8_MAX = 1.0 / 255

class U8 {
	public static readonly size = 1

	private static readonly MIN_VALUE = 0
	private static readonly MAX_VALUE = 255

	/**
	 * Converts integer input into a buffer representing an 8-bit unsigned
	 * integer.
	 *
	 * @param integer Integer to convert
	 */
	public static toBuffer(integer: number) {
		const buffer = Buffer.allocUnsafe(U8.size)

		if (integer > U8.MAX_VALUE) {
			buffer.writeUInt8(U8.MIN_VALUE, 0)
		} else if (integer < U8.MIN_VALUE) {
			buffer.writeUInt8(U8.MAX_VALUE, 0)
		} else {
			buffer.writeUInt8(integer, 0)
		}

		return buffer
	}

	/**
	 * Converts buffer input into an integer which was representing an 8-bit
	 * unsigned integer.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		return buffer.readUInt8(position)
	}

	/**
	 * Converts an 8-bit unsigned integer to a floating point number, to a certain
	 * degree of accuracy.
	 *
	 * @param value U8 wide number to convert.
	 * @param lower Lower limit for conversion.
	 * @param upper Upper limit for conversion.
	 * @returns Float value mapped to the target range.
	 */
	public static toFloat(value: number, lower: number, upper: number) {
		const normalized = value * ONE_OVER_U8_MAX
		const delta = upper - lower
		const output = normalized * delta + lower

		return Math.abs(output) < delta * ONE_OVER_U8_MAX ? 0.0 : output
	}
}

export default U8

import { Buffer } from "node:buffer"

class S64 {
	public static readonly size = 8

	private static readonly MIN_VALUE = BigInt("-9223372036854775808")
	private static readonly MAX_VALUE = BigInt("9223372036854775807")

	/**
	 * Converts integer input into a buffer representing a 64-bit signed integer.
	 *
	 * @param integer Integer to convert
	 */
	public static toBuffer(integer: number | bigint) {
		const buffer = Buffer.allocUnsafe(S64.size)
		const value = BigInt(integer)

		if (value > S64.MAX_VALUE) {
			buffer.writeBigInt64LE(S64.MIN_VALUE, 0)
		} else if (value < S64.MIN_VALUE) {
			buffer.writeBigInt64LE(S64.MAX_VALUE, 0)
		} else {
			buffer.writeBigInt64LE(value, 0)
		}

		return buffer
	}

	/**
	 * Converts buffer input into an integer which was representing a 64-bit
	 * signed integer.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		return buffer.readBigInt64LE(position)
	}
}

export default S64

import F32 from "./f32"
import type U16 from "./u16"

class Quaternion {
	public static readonly size: number = 12
	public static readonly zero: Array<number> = [0.0, 0.0, 0.0, 0.0]

	/**
	 * Converts array input into a buffer representing a quaternion.
	 *
	 * @param {number[]} quaternion Should contain 4 values
	 * @returns {Buffer}
	 */
	public static toBuffer(quaternion: Array<number>): Buffer {
		const buffer = Buffer.allocUnsafe(Quaternion.size)

		if (quaternion[3]! >= 0.0) {
			buffer.writeFloatLE(quaternion[0]!, 0)
			buffer.writeFloatLE(quaternion[1]!, 4)
			buffer.writeFloatLE(quaternion[2]!, 8)
		} else {
			buffer.writeFloatLE(-quaternion[0]!, 0)
			buffer.writeFloatLE(-quaternion[1]!, 4)
			buffer.writeFloatLE(-quaternion[2]!, 8)
		}

		return buffer
	}

	/**
	 * Converts buffer input into an array of float values representing a
	 * normalized quaternion.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 * @param {boolean} normalized True if value is normalized
	 * @param {Type} type Optional type overwrite
	 * @param lower Lower limit for optional type conversion
	 * @param upper Upper limit for optional type conversion
	 * @returns {number[]}
	 * @todo Handle these parameters better
	 */
	public static fromBuffer(
		buffer: Buffer,
		position = 0,
		normalized = true,
		type: typeof F32 | typeof U16 = F32,
		lower?: number,
		upper?: number,
	): Array<number> {
		const quaternion = [
			type.fromBuffer(buffer, position),
			type.fromBuffer(buffer, position + type.size),
			type.fromBuffer(buffer, position + type.size * 2),
			normalized ? 0.0 : type.fromBuffer(buffer, position + type.size * 3),
		]

		if (normalized) {
			const sum =
				1 -
				quaternion[0]! * quaternion[0]! -
				quaternion[1]! * quaternion[1]! -
				quaternion[2]! * quaternion[2]!

			quaternion[3] = sum > 0.0 ? Math.sqrt(sum) : 0.0
		}

		if ("toFloat" in type) {
			return quaternion.map((value) => type.toFloat(value!, lower!, upper!))
		}

		return quaternion
	}
}

export default Quaternion

import F32 from "./f32"
import type U16 from "./u16"

class Vector3 {
	public static readonly size: number = 12
	public static readonly zero: Array<number> = [0.0, 0.0, 0.0]

	/**
	 * Converts array input into a buffer representing a 3 point vector.
	 *
	 * @param {number[]} vector Should contain 3 values
	 * @returns {Buffer}
	 */
	public static toBuffer(vector: Array<number>): Buffer {
		const buffer = Buffer.allocUnsafe(Vector3.size)

		buffer.writeFloatLE(vector[0] ?? 0, 0)
		buffer.writeFloatLE(vector[1] ?? 0, 4)
		buffer.writeFloatLE(vector[2] ?? 0, 8)

		return buffer
	}

	/**
	 * Converts buffer input into an array of float values representing a 3 point
	 * vector.
	 *
	 * @param {Buffer} buffer Buffer to convert
	 * @param {number} position Position to read from
	 * @param {any} type Optional type overwrite
	 * @param {number} lower Lower limit for optional type conversion
	 * @param {number} upper Upper limit for optional type conversion
	 * @returns {number[]}
	 * @todo Handle these parameters better
	 */
	public static fromBuffer(
		buffer: Buffer,
		position = 0,
		type: typeof F32 | typeof U16 = F32,
		lower?: number,
		upper?: number,
	): Array<number> {
		const output = [
			type.fromBuffer(buffer, position),
			type.fromBuffer(buffer, position + type.size),
			type.fromBuffer(buffer, position + type.size * 2),
		]

		if ("toFloat" in type) {
			return output.map((value) => type.toFloat(value, lower ?? 0, upper ?? 0))
		}

		return output
	}

	/**
	 * Calculates the distance between two three wide number vectors.
	 *
	 * @param {number[]} from Position to calculate distance from
	 * @param {number[]} to Position to calculate distance to
	 * @returns {number}
	 */
	public static distance(from: Array<number>, to: Array<number>): number {
		const dx = (from[0] ?? 0) - (to[0] ?? 0)
		const dy = (from[1] ?? 0) - (to[1] ?? 0)
		const dz = (from[2] ?? 0) - (to[2] ?? 0)

		return Math.sqrt(dx * dx + dy * dy + dz * dz)
	}
}

export default Vector3

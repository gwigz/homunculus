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
	public static toBuffer(vector: Array<number>) {
		const buffer = Buffer.allocUnsafe(Vector3.size)

		buffer.writeFloatLE(vector?.[0] ?? 0, 0)
		buffer.writeFloatLE(vector?.[1] ?? 0, 4)
		buffer.writeFloatLE(vector?.[2] ?? 0, 8)

		return buffer
	}

	/**
	 * Converts buffer input into an array of float values representing a 3 point
	 * vector.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 * @param type Optional type overwrite
	 * @param lower Lower limit for optional type conversion
	 * @param upper Upper limit for optional type conversion
	 */
	public static fromBuffer(
		buffer: Buffer,
		position = 0,
		type: typeof F32 | typeof U16 = F32,
		lower?: number,
		upper?: number,
	) {
		const output = [
			type.fromBuffer(buffer, position),
			type.fromBuffer(buffer, position + type.size),
			type.fromBuffer(buffer, position + type.size * 2),
		]

		if ("toFloat" in type) {
			return output.map((value) =>
				type.toFloat(value, lower ?? 0, upper ?? 0),
			) as [x: number, y: number, z: number]
		}

		return output as [x: number, y: number, z: number]
	}

	/**
	 * Calculates the distance between two three wide number vectors.
	 *
	 * @param from Position to calculate distance from
	 * @param to Position to calculate distance to
	 */
	public static distance(from: Array<number>, to: Array<number>): number {
		const dx = (from[0] ?? 0) - (to[0] ?? 0)
		const dy = (from[1] ?? 0) - (to[1] ?? 0)
		const dz = (from[2] ?? 0) - (to[2] ?? 0)

		return Math.sqrt(dx * dx + dy * dy + dz * dz)
	}
}

export default Vector3

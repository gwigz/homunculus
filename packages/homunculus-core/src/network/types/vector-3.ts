import F32 from "./f32"
import type U16 from "./u16"

class Vector3 {
	public static readonly size: number = 12
	public static readonly zero = new Vector3(0, 0, 0)
	public static readonly one = new Vector3(1, 1, 1)

	constructor(
		readonly x: number,
		readonly y: number,
		readonly z: number,
	) {}

	/**
	 * Returns a string representation of the vector.
	 *
	 * @param vector Vector3
	 * @returns String in the format "<x, y, z>"
	 */
	public static toString(vector: Vector3) {
		return `<${vector.x}, ${vector.y}, ${vector.z}>`
	}

	/**
	 * Converts array input into a buffer representing a 3 point vector.
	 *
	 * @param {number[]} vector Should contain 3 values
	 * @returns {Buffer}
	 */
	public static toBuffer(vector: [x: number, y: number, z: number] | Vector3) {
		const buffer = Buffer.allocUnsafe(Vector3.size)

		if (Array.isArray(vector)) {
			buffer.writeFloatLE(vector[0] ?? 0, 0)
			buffer.writeFloatLE(vector[1] ?? 0, 4)
			buffer.writeFloatLE(vector[2] ?? 0, 8)
		} else {
			buffer.writeFloatLE(vector.x, 0)
			buffer.writeFloatLE(vector.y, 4)
			buffer.writeFloatLE(vector.z, 8)
		}

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

		return new Vector3(
			...(("toFloat" in type
				? output.map((value) => type.toFloat(value, lower ?? 0, upper ?? 0))
				: output) as [x: number, y: number, z: number]),
		)
	}

	/**
	 * Calculates the distance between two three wide number vectors.
	 *
	 * @param from Position to calculate distance from
	 * @param to Position to calculate distance to
	 */
	public static distance(from: Vector3, to: Vector3): number {
		const dx = from.x - to.x
		const dy = from.y - to.y
		const dz = from.z - to.z

		return Math.sqrt(dx * dx + dy * dy + dz * dz)
	}
}

export default Vector3

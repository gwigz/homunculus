import { Buffer } from "node:buffer"
import F32 from "./f32"
import type U16 from "./u16"

export class Vector3 {
	static readonly size = 12
	static readonly zero = new Vector3(0, 0, 0)
	static readonly one = new Vector3(1, 1, 1)

	constructor(
		public x: number,
		public y: number,
		public z: number,
	) {}

	/**
	 * Returns a string representation of the vector in the format `<x, y, z>`.
	 */
	public toString() {
		return `<${this.x}, ${this.y}, ${this.z}>`
	}

	/**
	 * Converts the vector to a buffer.
	 */
	public toBuffer() {
		return Vector3.toBuffer(this)
	}

	/**
	 * Converts array input into a buffer representing a 3 point vector.
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
	 * Calculates the distance between this vector and another vector.
	 */
	public distance(other: Vector3) {
		return Vector3.distance(this, other)
	}

	/**
	 * Calculates the distance between two vectors.
	 */
	public static distance(from: Vector3, to: Vector3) {
		const dx = from.x - to.x
		const dy = from.y - to.y
		const dz = from.z - to.z

		return Math.sqrt(dx * dx + dy * dy + dz * dz)
	}

	/**
	 * Normalizes this vector to a unit vector.
	 */
	public normalize() {
		return Vector3.normalize(this)
	}

	/**
	 * Normalizes a vector to a unit vector.
	 */
	public static normalize(vector: Vector3) {
		const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2)

		return new Vector3(
			vector.x / magnitude,
			vector.y / magnitude,
			vector.z / magnitude,
		)
	}

	/**
	 * Calculates the dot product between this vector and another vector.
	 */
	public dot(other: Vector3) {
		return Vector3.dot(this, other)
	}

	/**
	 * Calculates the dot product between two vectors.
	 */
	public static dot(left: Vector3, right: Vector3) {
		return left.x * right.x + left.y * right.y + left.z * right.z
	}

	/**
	 * Calculates the cross product between this vector and another vector.
	 */
	public cross(other: Vector3) {
		return Vector3.cross(this, other)
	}

	/**
	 * Calculates the cross product between two vectors.
	 */
	public static cross(left: Vector3, right: Vector3) {
		return new Vector3(
			left.y * right.z - left.z * right.y,
			left.z * right.x - left.x * right.z,
			left.x * right.y - left.y * right.x,
		)
	}

	/**
	 * Converts buffer input into a Vector3 instance.
	 *
	 * @param buffer Buffer to convert.
	 * @param position Position to read from.
	 * @param type Optional type overwrite.
	 * @param lower Lower limit for optional type conversion.
	 * @param upper Upper limit for optional type conversion.
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
}

export default Vector3

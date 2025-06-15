import { Buffer } from "node:buffer"

class Vector3D {
	public static readonly size: number = 24
	public static readonly zero = new Vector3D(0, 0, 0)
	public static readonly one = new Vector3D(1, 1, 1)

	constructor(
		readonly x: number,
		readonly y: number,
		readonly z: number,
	) {}

	public toString() {
		return `<${this.x}, ${this.y}, ${this.z}>`
	}

	public toBuffer() {
		return Vector3D.toBuffer(this)
	}

	/**
	 * Converts array input into a buffer representing a 3 point vector.
	 *
	 * @param {number[]} vector Should contain 3 values
	 * @returns {Buffer}
	 */
	public static toBuffer(
		vector: [x: number, y: number, z: number] | Vector3D,
	): Buffer {
		const buffer = Buffer.allocUnsafe(Vector3D.size)

		if (Array.isArray(vector)) {
			buffer.writeDoubleLE(vector[0] ?? 0, 0)
			buffer.writeDoubleLE(vector[1] ?? 0, 8)
			buffer.writeDoubleLE(vector[2] ?? 0, 16)
		} else {
			buffer.writeDoubleLE(vector.x, 0)
			buffer.writeDoubleLE(vector.y, 8)
			buffer.writeDoubleLE(vector.z, 16)
		}

		return buffer
	}

	/**
	 * Calculates the distance between this vector and another vector.
	 */
	public distance(other: Vector3D) {
		return Vector3D.distance(this, other)
	}

	/**
	 * Calculates the distance between two vectors.
	 */
	public static distance(from: Vector3D, to: Vector3D) {
		const dx = from.x - to.x
		const dy = from.y - to.y
		const dz = from.z - to.z

		return Math.hypot(dx, dy, dz)
	}

	/**
	 * Normalizes this vector to a unit vector.
	 */
	public normalize() {
		return Vector3D.normalize(this)
	}

	/**
	 * Normalizes a vector to a unit vector.
	 */
	public static normalize(vector: Vector3D) {
		const magnitude = Math.hypot(vector.x, vector.y, vector.z) || 1

		return new Vector3D(
			vector.x / magnitude,
			vector.y / magnitude,
			vector.z / magnitude,
		)
	}

	/**
	 * Calculates the dot product between this vector and another vector.
	 */
	public dot(other: Vector3D) {
		return Vector3D.dot(this, other)
	}

	/**
	 * Calculates the dot product between two vectors.
	 */
	public static dot(left: Vector3D, right: Vector3D) {
		return left.x * right.x + left.y * right.y + left.z * right.z
	}

	/**
	 * Calculates the cross product between this vector and another vector.
	 */
	public cross(other: Vector3D) {
		return Vector3D.cross(this, other)
	}

	/**
	 * Calculates the cross product between two vectors.
	 */
	public static cross(left: Vector3D, right: Vector3D) {
		return new Vector3D(
			left.y * right.z - left.z * right.y,
			left.z * right.x - left.x * right.z,
			left.x * right.y - left.y * right.x,
		)
	}

	/**
	 * Calculates the length of the vector.
	 */
	public length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
	}

	/**
	 * Converts buffer input into an array of double values representing a 3 point
	 * vector.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 * @returns {number[]}
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		return new Vector3D(
			buffer.readDoubleLE(position),
			buffer.readDoubleLE(position + 8),
			buffer.readDoubleLE(position + 16),
		)
	}
}

export default Vector3D

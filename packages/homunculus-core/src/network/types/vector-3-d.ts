import { Buffer } from "node:buffer"

class Vector3D {
	public static readonly size: number = 24
	public static readonly zero = new Vector3D(0, 0, 0)

	constructor(
		readonly x: number,
		readonly y: number,
		readonly z: number,
	) {}

	public static toString(vector: Vector3D) {
		return `<${vector.x}, ${vector.y}, ${vector.z}>`
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

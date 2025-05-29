import { Buffer } from "node:buffer"

class Vector4 {
	public static readonly size: number = 16
	public static readonly zero = new Vector4(0, 0, 0, 0)

	constructor(
		readonly x: number,
		readonly y: number,
		readonly z: number,
		readonly w: number,
	) {}

	public static toString(vector: Vector4) {
		return `<${vector.x}, ${vector.y}, ${vector.z}, ${vector.w}>`
	}

	/**
	 * Converts array input into a buffer representing a 4 point vector.
	 *
	 * @param {number[]} vector Should contain 4 values
	 * @returns {Buffer}
	 */
	public static toBuffer(
		vector: [x: number, y: number, z: number, w: number] | Vector4,
	): Buffer {
		const buffer = Buffer.allocUnsafe(Vector4.size)

		if (Array.isArray(vector)) {
			buffer.writeFloatLE(vector[0] ?? 0, 0)
			buffer.writeFloatLE(vector[1] ?? 0, 4)
			buffer.writeFloatLE(vector[2] ?? 0, 8)
			buffer.writeFloatLE(vector[3] ?? 0, 12)
		} else {
			buffer.writeFloatLE(vector.x, 0)
			buffer.writeFloatLE(vector.y, 4)
			buffer.writeFloatLE(vector.z, 8)
			buffer.writeFloatLE(vector.w, 12)
		}

		return buffer
	}

	/**
	 * Converts buffer input into an array of float values representing a 4 point
	 * vector.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 * @returns {number[]}
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		return new Vector4(
			buffer.readFloatLE(position),
			buffer.readFloatLE(position + 4),
			buffer.readFloatLE(position + 8),
			buffer.readFloatLE(position + 12),
		)
	}
}

export default Vector4

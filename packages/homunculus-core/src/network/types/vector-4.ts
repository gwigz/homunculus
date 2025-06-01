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

	public static distance(a: Vector4, b: Vector4): number {
		const dx = b.x - a.x
		const dy = b.y - a.y
		const dz = b.z - a.z
		const dw = b.w - a.w

		return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw)
	}

	public static dot(a: Vector4, b: Vector4): number {
		return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w
	}

	public static add(a: Vector4, b: Vector4): Vector4 {
		return new Vector4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w)
	}

	public static subtract(a: Vector4, b: Vector4): Vector4 {
		return new Vector4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w)
	}

	public static multiply(vector: Vector4, scalar: number): Vector4 {
		return new Vector4(
			vector.x * scalar,
			vector.y * scalar,
			vector.z * scalar,
			vector.w * scalar,
		)
	}

	public magnitude(): number {
		return Math.sqrt(
			this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w,
		)
	}

	public normalize(): Vector4 {
		const mag = this.magnitude()
		if (mag === 0) return Vector4.zero
		return Vector4.multiply(this, 1 / mag)
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

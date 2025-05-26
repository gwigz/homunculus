import F32 from "./f32"
import type U16 from "./u16"
import Vector3 from "./vector-3"

class Quaternion {
	public static readonly size: number = 12
	public static readonly zero = new Quaternion(0, 0, 0, 0)
	public static readonly identity = new Quaternion(0, 0, 0, 1)

	constructor(
		readonly x: number,
		readonly y: number,
		readonly z: number,
		readonly w: number,
	) {}

	/**
	 * Returns a string representation of the quaternion.
	 *
	 * @returns {string} String in the format "<x, y, z, w>"
	 */
	public static toString(quaternion: Quaternion) {
		return `<${quaternion.x}, ${quaternion.y}, ${quaternion.z}, ${quaternion.w}>`
	}

	/**
	 * Converts array input into a buffer representing a quaternion.
	 *
	 * @param {number[]} quaternion Should contain 4 values
	 * @returns {Buffer}
	 */
	public static toBuffer(
		quaternion: [x: number, y: number, z: number, w: number] | Quaternion,
	): Buffer {
		const buffer = Buffer.allocUnsafe(Quaternion.size)

		if (Array.isArray(quaternion)) {
			if (quaternion[3]! >= 0.0) {
				buffer.writeFloatLE(quaternion[0]!, 0)
				buffer.writeFloatLE(quaternion[1]!, 4)
				buffer.writeFloatLE(quaternion[2]!, 8)
			} else {
				buffer.writeFloatLE(-quaternion[0]!, 0)
				buffer.writeFloatLE(-quaternion[1]!, 4)
				buffer.writeFloatLE(-quaternion[2]!, 8)
			}
		} else if (quaternion.w >= 0.0) {
			buffer.writeFloatLE(quaternion.x, 0)
			buffer.writeFloatLE(quaternion.y, 4)
			buffer.writeFloatLE(quaternion.z, 8)
		} else {
			buffer.writeFloatLE(-quaternion.x, 0)
			buffer.writeFloatLE(-quaternion.y, 4)
			buffer.writeFloatLE(-quaternion.z, 8)
		}

		return buffer
	}

	/**
	 * Converts buffer input into an array of float values representing a
	 * normalized quaternion.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 * @param normalized True if value is normalized
	 * @param type Optional type overwrite
	 * @param lower Lower limit for optional type conversion
	 * @param upper Upper limit for optional type conversion
	 * @todo Handle these parameters better
	 */
	public static fromBuffer(
		buffer: Buffer,
		position = 0,
		normalized = true,
		type: typeof F32 | typeof U16 = F32,
		lower?: number,
		upper?: number,
	) {
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
			return new Quaternion(
				type.toFloat(quaternion[0]!, lower!, upper!),
				type.toFloat(quaternion[1]!, lower!, upper!),
				type.toFloat(quaternion[2]!, lower!, upper!),
				type.toFloat(quaternion[3]!, lower!, upper!),
			)
		}

		return new Quaternion(
			quaternion[0]!,
			quaternion[1]!,
			quaternion[2]!,
			quaternion[3]!,
		)
	}

	/**
	 * Converts euler angles to a quaternion.
	 *
	 * @param euler Euler angles in radians
	 * @returns Quaternion
	 */
	public static fromEuler(euler: [x: number, y: number, z: number] | Vector3) {
		let x: number
		let y: number
		let z: number

		if (Array.isArray(euler)) {
			x = euler[0]! / 2
			y = euler[1]! / 2
			z = euler[2]! / 2
		} else {
			x = euler.x / 2
			y = euler.y / 2
			z = euler.z / 2
		}

		const c1 = Math.cos(y)
		const s1 = Math.sin(y)
		const c2 = Math.cos(x)
		const s2 = Math.sin(x)
		const c3 = Math.cos(z)
		const s3 = Math.sin(z)

		return new Quaternion(
			s1 * c2 * s3 + c1 * s2 * c3,
			s1 * c2 * c3 - c1 * s2 * s3,
			c1 * c2 * s3 - s1 * s2 * c3,
			c1 * c2 * c3 + s1 * s2 * s3,
		)
	}

	/**
	 * Converts a quaternion to euler angles.
	 *
	 * @param quaternion Quaternion
	 * @returns Euler angles in radians
	 */
	public static toEuler(quaternion: Quaternion) {
		// roll
		const x = Math.atan2(
			2 * (quaternion.w * quaternion.x + quaternion.y * quaternion.z),
			1 - 2 * (quaternion.x * quaternion.x + quaternion.y * quaternion.y),
		)

		// pitch
		const y = Math.asin(
			2 * (quaternion.w * quaternion.y - quaternion.z * quaternion.x),
		)

		// yaw
		const z = Math.atan2(
			2 * (quaternion.w * quaternion.z + quaternion.x * quaternion.y),
			1 - 2 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z),
		)

		return new Vector3(x, y, z)
	}
}

export default Quaternion

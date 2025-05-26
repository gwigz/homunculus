import U8 from "./u8"

class Color4 {
	public static readonly size: number = 4
	public static readonly zero = new Color4(0, 0, 0, 0)

	constructor(
		readonly r: number,
		readonly g: number,
		readonly b: number,
		readonly a: number,
	) {}

	/**
	 * Returns a string representation of the color.
	 *
	 * @param color Color4
	 * @returns String in the format "<r, g, b, a>"
	 */
	public static toString(color: Color4) {
		return `<${color.r}, ${color.g}, ${color.b}, ${color.a}>`
	}

	/**
	 * Converts array input into a buffer representing a 4-component color.
	 *
	 * @param color Should contain 4 values (RGBA)
	 */
	public static toBuffer(
		color: [r: number, g: number, b: number, a: number] | Color4,
	) {
		const buffer = Buffer.allocUnsafe(Color4.size)

		if (Array.isArray(color)) {
			buffer.writeUInt8(color[0] ?? 0, 0)
			buffer.writeUInt8(color[1] ?? 0, 1)
			buffer.writeUInt8(color[2] ?? 0, 2)
			buffer.writeUInt8(color[3] ?? 0, 3)
		} else {
			buffer.writeUInt8(color.r, 0)
			buffer.writeUInt8(color.g, 1)
			buffer.writeUInt8(color.b, 2)
			buffer.writeUInt8(color.a, 3)
		}

		return buffer
	}

	/**
	 * Converts buffer input into an array of U8 values representing a 4-component color.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		return new Color4(
			U8.fromBuffer(buffer, position),
			U8.fromBuffer(buffer, position + 1),
			U8.fromBuffer(buffer, position + 2),
			U8.fromBuffer(buffer, position + 3),
		)
	}
}

export default Color4

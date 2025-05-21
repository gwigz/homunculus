import U8 from "./u8"

class Color4 {
	public static readonly size: number = 4
	public static readonly zero: Array<number> = [0, 0, 0, 0]

	/**
	 * Converts array input into a buffer representing a 4-component color.
	 *
	 * @param color Should contain 4 values (RGBA)
	 */
	public static toBuffer(color: Array<number>) {
		const buffer = Buffer.allocUnsafe(Color4.size)

		buffer.writeUInt8(color[0] ?? 0, 0)
		buffer.writeUInt8(color[1] ?? 0, 1)
		buffer.writeUInt8(color[2] ?? 0, 2)
		buffer.writeUInt8(color[3] ?? 0, 3)

		return buffer
	}

	/**
	 * Converts buffer input into an array of U8 values representing a 4-component color.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		return [
			U8.fromBuffer(buffer, position),
			U8.fromBuffer(buffer, position + 1),
			U8.fromBuffer(buffer, position + 2),
			U8.fromBuffer(buffer, position + 3),
		] as [r: number, g: number, b: number, a: number]
	}
}

export default Color4

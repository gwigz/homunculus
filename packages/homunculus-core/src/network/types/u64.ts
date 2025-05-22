class U64 {
	public static readonly size: number = 8

	/**
	 * Converts BigInt input into a buffer representing an 64-bit unsigned integer.
	 *
	 * @param integer Integer to convert
	 * @returns
	 */
	public static toBuffer(integer: number | bigint) {
		const buffer = Buffer.allocUnsafe(U64.size)
		const value = typeof integer === "bigint" ? integer : BigInt(integer)

		buffer.writeUInt32LE(Number(value & 0xffffffffn), 0)
		buffer.writeUInt32LE(Number((value >> 32n) & 0xffffffffn), 4)

		return buffer
	}

	/**
	 * Converts buffer input into a BigInt which was representing an 64-bit unsigned
	 * integer.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		return (
			BigInt.asUintN(32, BigInt(buffer.readUInt32LE(position))) |
			(BigInt.asUintN(32, BigInt(buffer.readUInt32LE(position + 4))) << 32n)
		)
	}
}

export default U64

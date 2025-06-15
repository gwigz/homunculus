import type { Primitive } from "./primitive"

export const U64 = {
	MIN_VALUE: 0n,
	MAX_VALUE: 18446744073709551615n,
	size: () => 8,
	encode: (number, buffer, offset) => {
		const clamped =
			number > U64.MAX_VALUE
				? U64.MAX_VALUE
				: number < U64.MIN_VALUE
					? U64.MIN_VALUE
					: number

		buffer.writeUInt32LE(Number(clamped & 0xffffffffn), offset)
		buffer.writeUInt32LE(Number((clamped >> 32n) & 0xffffffffn), offset + 4)

		return offset + 8
	},
	decode: (buffer, state) => {
		const value =
			BigInt.asUintN(32, BigInt(buffer.readUInt32LE(state.offset))) |
			(BigInt.asUintN(32, BigInt(buffer.readUInt32LE(state.offset + 4))) << 32n)

		state.offset += 8

		return value
	},
} as const satisfies Primitive<bigint>

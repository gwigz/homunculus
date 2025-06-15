import type { Primitive } from "./primitive"

export const U8 = {
	MAX_VALUE: 255,
	MIN_VALUE: 0,
	size: () => 1,
	encode: (number, buffer, offset) => {
		buffer.writeUInt8(
			number > U8.MAX_VALUE
				? U8.MAX_VALUE
				: number < U8.MIN_VALUE
					? U8.MIN_VALUE
					: number,
			offset,
		)

		return offset + 1
	},
	decode: (buffer, state) => {
		const value = buffer.readUInt8(state.offset)

		state.offset += 1

		return value
	},
} as const satisfies Primitive<number>

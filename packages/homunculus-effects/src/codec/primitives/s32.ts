import type { Primitive } from "./primitive"

export const S32 = {
	MAX_VALUE: 2147483647,
	MIN_VALUE: -2147483648,
	size: () => 4,
	encode: (number, buffer, offset) => {
		buffer.writeInt32LE(
			number > S32.MAX_VALUE
				? S32.MAX_VALUE
				: number < S32.MIN_VALUE
					? S32.MIN_VALUE
					: number,
			offset,
		)

		return offset + 4
	},
	decode: (buffer, state) => {
		const value = buffer.readInt32LE(state.offset)

		state.offset += 4

		return value
	},
} as const satisfies Primitive<number>

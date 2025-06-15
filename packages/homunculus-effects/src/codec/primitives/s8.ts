import type { Primitive } from "./primitive"

export const S8 = {
	MIN_VALUE: -128,
	MAX_VALUE: 127,
	size: () => 1,
	encode: (number, buffer, offset) => {
		buffer.writeInt8(number, offset)

		return offset + 1
	},
	decode: (buffer, state) => {
		const value = buffer.readInt8(state.offset)

		state.offset += 1

		return value
	},
} as const satisfies Primitive<number>

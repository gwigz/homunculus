import type { Primitive } from "./primitive"

export const F64 = {
	size: () => 8,
	encode: (number, buffer, offset) => {
		buffer.writeDoubleLE(number, offset)

		return offset + 8
	},
	decode: (buffer, state) => {
		const value = buffer.readDoubleLE(state.offset)

		state.offset += 8

		return value
	},
} as const satisfies Primitive<number>

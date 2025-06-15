import type { Primitive } from "./primitive"

export const F32 = {
	size: () => 4,
	encode: (number, buffer, offset) => {
		buffer.writeFloatLE(number, offset)

		return offset + 4
	},
	decode: (buffer, state) => {
		const value = buffer.readFloatLE(state.offset)

		state.offset += 4

		return value
	},
} as const satisfies Primitive<number>

import type { Primitive } from "./primitive"

export const S16 = {
	MIN_VALUE: -32768,
	MAX_VALUE: 32767,
	size: () => 2,
	encode: (number, buffer, offset) => {
		buffer.writeInt16LE(number, offset)

		return offset + 2
	},
	decode: (buffer, state) => {
		const value = buffer.readInt16LE(state.offset)

		state.offset += 2

		return value
	},
} as const satisfies Primitive<number>

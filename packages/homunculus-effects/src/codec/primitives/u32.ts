import type { Primitive } from "./primitive"

export const U32 = {
	MIN_VALUE: 0,
	MAX_VALUE: 4294967295,
	size: () => 4,
	encode: (number, buffer, offset) => {
		buffer.writeUInt32LE(
			number > U32.MAX_VALUE
				? U32.MAX_VALUE
				: number < U32.MIN_VALUE
					? U32.MIN_VALUE
					: number,
			offset,
		)

		return offset + 4
	},
	decode: (buffer, state) => {
		const value = buffer.readUInt32LE(state.offset)

		state.offset += 4

		return value
	},
} as const satisfies Primitive<number>

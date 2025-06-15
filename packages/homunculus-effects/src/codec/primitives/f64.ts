import type { Primitive } from "./primitive"

export const F64 = {
	size: () => 8,
	encode: (number, buffer, offset) => {
		buffer.writeDoubleLE(number, offset)

		return offset + 8
	},
	decode: (buffer, offset) => [buffer.readDoubleLE(offset), offset + 8],
} as const satisfies Primitive<number>

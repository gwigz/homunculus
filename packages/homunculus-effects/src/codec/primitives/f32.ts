import type { Primitive } from "./primitive"

export const F32 = {
	size: () => 4,
	encode: (number, buffer, offset) => {
		buffer.writeFloatLE(number, offset)

		return offset + 4
	},
	decode: (buffer, offset) => [buffer.readFloatLE(offset), offset + 4],
} as const satisfies Primitive<number>

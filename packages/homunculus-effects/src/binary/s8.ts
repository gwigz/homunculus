import type { Codec } from "./codec"

export const S8 = {
	MIN_VALUE: -128,
	MAX_VALUE: 127,
	size: () => 1,
	encode: (number, buffer, offset) => {
		buffer.writeInt8(number, offset)

		return offset + 1
	},
	decode: (buffer, offset) => [buffer.readInt8(offset), offset + 1],
} as const satisfies Codec<number>

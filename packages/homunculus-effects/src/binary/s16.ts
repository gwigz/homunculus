import type { Codec } from "./codec"

export const S16 = {
	MIN_VALUE: -32768,
	MAX_VALUE: 32767,
	size: () => 2,
	encode: (number, buffer, offset) => {
		buffer.writeInt16LE(number, offset)

		return offset + 2
	},
	decode: (buffer, offset) => [buffer.readInt16LE(offset), offset + 2],
} as const satisfies Codec<number>

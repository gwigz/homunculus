import type { Codec } from "./codec"

export const U8 = {
	MAX_VALUE: 255,
	MIN_VALUE: 0,
	size: () => 1,
	encode: (number, buffer, offset) => {
		buffer.writeUInt8(
			number > U8.MAX_VALUE
				? U8.MAX_VALUE
				: number < U8.MIN_VALUE
					? U8.MIN_VALUE
					: number,
			offset,
		)

		return offset + 1
	},
	decode: (buffer, offset) => [buffer.readUInt8(offset), offset + 1],
} as const satisfies Codec<number>

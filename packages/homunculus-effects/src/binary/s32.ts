import type { Codec } from "./codec"

export const S32 = {
	MAX_VALUE: 2147483647,
	MIN_VALUE: -2147483648,
	size: () => 4,
	encode: (number, buffer, offset) => {
		buffer.writeInt32LE(
			number > S32.MAX_VALUE
				? S32.MAX_VALUE
				: number < S32.MIN_VALUE
					? S32.MIN_VALUE
					: number,
			offset,
		)

		return offset + 4
	},
	decode: (buffer, offset) => [buffer.readInt32LE(offset), offset + 4],
} as const satisfies Codec<number>

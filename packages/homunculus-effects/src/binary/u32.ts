import type { Codec } from "./codec"

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
	decode: (buffer, offset) => [buffer.readUInt32LE(offset), offset + 4],
} as const satisfies Codec<number>

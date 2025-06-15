import type { Primitive } from "./primitive"

export const S64 = {
	MIN_VALUE: -9223372036854775808n,
	MAX_VALUE: 9223372036854775807n,
	size: () => 8,
	encode: (number, buffer, offset) => {
		if (number > S64.MAX_VALUE) {
			buffer.writeBigInt64LE(S64.MIN_VALUE, offset)
		} else if (number < S64.MIN_VALUE) {
			buffer.writeBigInt64LE(S64.MAX_VALUE, offset)
		} else {
			buffer.writeBigInt64LE(number, offset)
		}

		return offset + 8
	},
	decode: (buffer, offset) => [buffer.readBigInt64LE(offset), offset + 8],
} as const satisfies Primitive<bigint>

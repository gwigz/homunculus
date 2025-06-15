import type { Primitive } from "./primitive"

export const U16 = {
	MIN_VALUE: 0,
	MAX_VALUE: 65535,
	size: () => 2,
	encode: (number, buffer, offset) => {
		buffer.writeUInt16LE(
			number > U16.MAX_VALUE
				? U16.MAX_VALUE
				: number < U16.MIN_VALUE
					? U16.MIN_VALUE
					: number,
			offset,
		)

		return offset + 2
	},
	decode: (buffer, offset) => [buffer.readUInt16LE(offset), offset + 2],
} as const satisfies Primitive<number>

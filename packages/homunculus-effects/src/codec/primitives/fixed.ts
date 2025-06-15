import type { Primitive } from "./primitive"

export function fixed(size: number) {
	return {
		size: () => size,
		encode: (value, buffer, offset) => {
			if (value.length === size) {
				buffer.set(value, offset)
			} else if (value.length > size) {
				buffer.set(value.subarray(0, size), offset)
			} else {
				const output = Buffer.alloc(size)

				value.copy(output, 0, 0, Math.min(value.length, size))
				buffer.set(output, offset)
			}

			return offset + size
		},
		decode: (buffer, offset) => {
			const end = offset + size

			return [buffer.subarray(offset, end), end]
		},
	} as const satisfies Primitive<Buffer>
}

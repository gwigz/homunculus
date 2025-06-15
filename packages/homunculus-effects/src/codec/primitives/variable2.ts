import type { Primitive } from "./primitive"

const MAX_LENGTH = 65535

export const Variable2 = {
	size: (value) => 2 + (value?.length ?? 0),
	encode: (value, buffer, offset) => {
		const length = Math.min(MAX_LENGTH, value?.length ?? 0)

		buffer.writeUInt16LE(length, offset)
		value.copy(buffer, offset + 2, 0, length)

		return offset + 2 + length
	},
	decode: (buffer, state) => {
		const length = buffer.readUInt16LE(state.offset)
		const value = buffer.subarray(state.offset + 2, state.offset + 2 + length)

		state.offset += 2 + length

		return value
	},
} as const satisfies Primitive<Buffer>

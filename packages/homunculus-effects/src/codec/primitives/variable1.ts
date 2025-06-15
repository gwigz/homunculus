import type { Primitive } from "./primitive"

const MAX_LENGTH = 255

export const Variable1 = {
	size: (value) => 1 + (value?.length ?? 0),
	encode: (value, buffer, offset) => {
		const length = Math.min(MAX_LENGTH, value?.length ?? 0)

		buffer.writeUInt8(length, offset)
		value.copy(buffer, offset + 1, 0, length)

		return offset + 1 + length
	},
	decode: (buffer, state) => {
		const length = buffer.readUInt8(state.offset)
		const value = buffer.subarray(state.offset + 1, state.offset + 1 + length)

		state.offset += 1 + length

		return value
	},
} as const satisfies Primitive<Buffer>

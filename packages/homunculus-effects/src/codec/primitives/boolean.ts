import type { Primitive } from "./primitive"

// biome-ignore lint/suspicious/noShadowRestrictedNames: used as `Codec.Boolean`
export const Boolean = {
	size: () => 1,
	encode: (boolean, buffer, offset) => {
		buffer.writeUInt8(Number(!!boolean), offset)

		return offset + 1
	},
	decode: (buffer, state) => {
		const value = !!buffer.readUInt8(state.offset)

		state.offset += 1

		return value
	},
} as const satisfies Primitive<boolean>

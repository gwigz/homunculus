import type { Codec } from "./codec"

// biome-ignore lint/suspicious/noShadowRestrictedNames: used as `Codec.Boolean`

export const Boolean = {
	size: () => 1,
	encode: (boolean, buffer, offset) => {
		buffer.writeUInt8(Number(!!boolean), offset)

		return offset + 1
	},
	decode: (buffer, offset) => [!!buffer.readUInt8(offset), offset + 1],
} as const satisfies Codec<boolean>

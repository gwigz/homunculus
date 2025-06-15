import type { Codec } from "./codec"
import type * as Types from "./types"

export const UUID = {
	size: () => 16,
	encode: (uuid: Types.UUID, buffer, offset) => {
		buffer.write(uuid.replace(/-/g, ""), offset, "hex")

		return offset + 16
	},
	decode: (buffer, offset) => {
		const hex = buffer.toString("hex", offset, offset + 16)
		const output = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`

		return [output as Types.UUID, offset + 16]
	},
} as const satisfies Codec<Types.UUID>

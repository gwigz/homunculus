import type * as Types from "~/model/types"
import type { Primitive } from "./primitive"

export const UUID = {
	size: () => 16,
	encode: (uuid: Types.UUID, buffer, offset) => {
		buffer.write(uuid.replace(/-/g, ""), offset, "hex")

		return offset + 16
	},
	decode: (buffer, state) => {
		const hex = buffer.toString("hex", state.offset, state.offset + 16)
		const output = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`

		state.offset += 16

		return output as Types.UUID
	},
} as const satisfies Primitive<Types.UUID>

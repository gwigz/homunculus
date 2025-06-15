import * as Types from "~/model/types"
import type { Primitive } from "./primitive"

export const Color4 = {
	size: () => 4,
	encode: (color, buffer, offset) => {
		buffer.writeUInt8(color.r, offset)
		buffer.writeUInt8(color.g, offset + 1)
		buffer.writeUInt8(color.b, offset + 2)
		buffer.writeUInt8(color.a, offset + 3)

		return offset + 4
	},
	decode: (buffer, state) => {
		const value = Types.Color4({
			r: buffer.readUInt8(state.offset),
			g: buffer.readUInt8(state.offset + 1),
			b: buffer.readUInt8(state.offset + 2),
			a: buffer.readUInt8(state.offset + 3),
		})

		state.offset += 4

		return value
	},
} as const satisfies Primitive<Types.Color4>

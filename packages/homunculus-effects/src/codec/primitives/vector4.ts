import * as Types from "~/model/types"
import type { Primitive } from "./primitive"

export const Vector4 = {
	size: () => 16,
	encode: (vector, buffer, offset) => {
		buffer.writeFloatLE(vector.x, offset)
		buffer.writeFloatLE(vector.y, offset + 4)
		buffer.writeFloatLE(vector.z, offset + 8)
		buffer.writeFloatLE(vector.w, offset + 12)

		return offset + 16
	},
	decode: (buffer, state) => {
		const value = Types.Vector4({
			x: buffer.readFloatLE(state.offset),
			y: buffer.readFloatLE(state.offset + 4),
			z: buffer.readFloatLE(state.offset + 8),
			w: buffer.readFloatLE(state.offset + 12),
		})

		state.offset += 16

		return value
	},
} as const satisfies Primitive<Types.Vector4>

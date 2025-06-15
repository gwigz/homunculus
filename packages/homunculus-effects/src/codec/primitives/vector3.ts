import * as Types from "~/model/types"
import type { Primitive } from "./primitive"

export const Vector3 = {
	size: () => 12,
	encode: (vector, buffer, offset) => {
		buffer.writeFloatLE(vector.x, offset)
		buffer.writeFloatLE(vector.y, offset + 4)
		buffer.writeFloatLE(vector.z, offset + 8)

		return offset + 12
	},
	decode: (buffer, state) => {
		const value = Types.Vector3({
			x: buffer.readFloatLE(state.offset),
			y: buffer.readFloatLE(state.offset + 4),
			z: buffer.readFloatLE(state.offset + 8),
		})

		state.offset += 12

		return value
	},
} as const satisfies Primitive<Types.Vector3>

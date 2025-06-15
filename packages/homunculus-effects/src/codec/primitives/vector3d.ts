import * as Types from "~/model/types"
import type { Primitive } from "./primitive"

export const Vector3D = {
	size: () => 24,
	encode: (vector, buffer, offset) => {
		buffer.writeDoubleLE(vector.x, offset)
		buffer.writeDoubleLE(vector.y, offset + 8)
		buffer.writeDoubleLE(vector.z, offset + 16)

		return offset + 24
	},
	decode: (buffer, state) => {
		const value = Types.Vector3({
			x: buffer.readDoubleLE(state.offset),
			y: buffer.readDoubleLE(state.offset + 8),
			z: buffer.readDoubleLE(state.offset + 16),
		})

		state.offset += 24

		return value
	},
} as const satisfies Primitive<Types.Vector3>

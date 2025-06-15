import * as Types from "../model/types"
import type { Primitive } from "./primitive"

export const Vector3D = {
	size: () => 24,
	encode: (vector, buffer, offset) => {
		buffer.writeDoubleLE(vector.x, offset)
		buffer.writeDoubleLE(vector.y, offset + 8)
		buffer.writeDoubleLE(vector.z, offset + 16)

		return offset + 24
	},
	decode: (buffer, offset) => [
		Types.Vector3({
			x: buffer.readDoubleLE(offset),
			y: buffer.readDoubleLE(offset + 8),
			z: buffer.readDoubleLE(offset + 16),
		}),
		24,
	],
} as const satisfies Primitive<Types.Vector3>

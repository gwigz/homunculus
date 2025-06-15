import * as Types from "../model/types"
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
	decode: (buffer, offset) => [
		Types.Vector4({
			x: buffer.readFloatLE(offset),
			y: buffer.readFloatLE(offset + 4),
			z: buffer.readFloatLE(offset + 8),
			w: buffer.readFloatLE(offset + 12),
		}),
		16,
	],
} as const satisfies Primitive<Types.Vector4>

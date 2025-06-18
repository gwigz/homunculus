import * as Types from "~/model/types"
import type { Primitive } from "./primitive"

export const Quaternion = {
	size: () => 12,
	encode: (quaternion: Types.Quaternion, buffer, offset) => {
		if (quaternion.w < 0) {
			buffer.writeFloatLE(-quaternion.x, offset)
			buffer.writeFloatLE(-quaternion.y, offset + 4)
			buffer.writeFloatLE(-quaternion.z, offset + 8)
		} else {
			buffer.writeFloatLE(quaternion.x, offset)
			buffer.writeFloatLE(quaternion.y, offset + 4)
			buffer.writeFloatLE(quaternion.z, offset + 8)
		}

		return offset + 12
	},
	decode: (buffer, state) => {
		const x = buffer.readFloatLE(state.offset)
		const y = buffer.readFloatLE(state.offset + 4)
		const z = buffer.readFloatLE(state.offset + 8)
		const w = Math.sqrt(1 - Math.hypot(x, y, z) ** 2)

		const value = Types.Quaternion({
			x,
			y,
			z,
			w,
		})

		state.offset += 12

		return value
	},
} as const satisfies Primitive<Types.Quaternion>

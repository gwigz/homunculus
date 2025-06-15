import * as Types from "~/model/types"
import type { Primitive } from "./primitive"

export const NormalizedQuaternion = {
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
		const value = Types.Quaternion({
			x: buffer.readFloatLE(state.offset),
			y: buffer.readFloatLE(state.offset + 4),
			z: buffer.readFloatLE(state.offset + 8),
			w: 0,
		})

		state.offset += 12

		return value
	},
} as const satisfies Primitive<Types.Quaternion>

export const Quaternion = {
	size: () => 16,
	encode: (quaternion: Types.Quaternion, buffer, offset) => {
		buffer.writeFloatLE(quaternion.x, offset)
		buffer.writeFloatLE(quaternion.y, offset + 4)
		buffer.writeFloatLE(quaternion.z, offset + 8)
		buffer.writeFloatLE(quaternion.w, offset + 12)

		return offset + 16
	},
	decode: (buffer, state) => {
		const value = Types.Quaternion({
			x: buffer.readFloatLE(state.offset),
			y: buffer.readFloatLE(state.offset + 4),
			z: buffer.readFloatLE(state.offset + 8),
			w: buffer.readFloatLE(state.offset + 12),
		})

		state.offset += 16

		return value
	},
} as const satisfies Primitive<Types.Quaternion>

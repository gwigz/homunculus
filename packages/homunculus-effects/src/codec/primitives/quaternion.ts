import * as Types from "../model/types"
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
	decode: (buffer, offset) => [
		Types.Quaternion({
			x: buffer.readFloatLE(offset),
			y: buffer.readFloatLE(offset + 4),
			z: buffer.readFloatLE(offset + 8),
			w: 0,
		}),
		12,
	],
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
	decode: (buffer, offset) => [
		Types.Quaternion({
			x: buffer.readFloatLE(offset),
			y: buffer.readFloatLE(offset + 4),
			z: buffer.readFloatLE(offset + 8),
			w: buffer.readFloatLE(offset + 12),
		}),
		16,
	],
} as const satisfies Primitive<Types.Quaternion>

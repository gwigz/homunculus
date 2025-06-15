// import { Buffer } from "node:buffer"

import type { Codec } from "./codec"

export const IP = {
	size: () => 4,
	encode: (ip, buffer, offset) => {
		const parts = ip.split(".")

		buffer.set(
			[
				Number.parseInt(parts[0] ?? "0", 10),
				Number.parseInt(parts[1] ?? "0", 10),
				Number.parseInt(parts[2] ?? "0", 10),
				Number.parseInt(parts[3] ?? "0", 10),
			],
			offset,
		)

		return offset + 4
	},
	decode: (buffer, offset) => {
		const data = buffer.subarray(offset, offset + 4)
		const ip = `${data[0]}.${data[1]}.${data[2]}.${data[3]}`

		return [ip, offset + 4]
	},
} as const as Codec<string>

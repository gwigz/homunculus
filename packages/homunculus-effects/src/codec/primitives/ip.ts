import type { Primitive } from "./primitive"

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
	decode: (buffer, state) => {
		const data = buffer.subarray(state.offset, state.offset + 4)
		const ip = `${data[0]}.${data[1]}.${data[2]}.${data[3]}`

		state.offset += 4

		return ip
	},
} as const as Primitive<string>

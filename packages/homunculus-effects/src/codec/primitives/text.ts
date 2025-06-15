import type { Primitive } from "./primitive"

export const Text = {
	size: (text) => (text?.replace(/\0.*/g, "").length ?? 0) + 1,
	encode: (text, buffer, offset) => {
		const sanitized = text.replace(/\0.*/g, "").concat("\0")

		buffer.write(sanitized, offset, "utf-8")

		return offset + sanitized.length
	},
	decode: (buffer, state) => {
		const bytes = []

		for (const byte of buffer.subarray(state.offset)) {
			// marks the end of the text
			if (byte === 0x00) {
				break
			}

			bytes.push(byte)
		}

		state.offset += bytes.length + 1

		return Buffer.from(bytes).toString("utf-8").slice(0, -1)
	},
} as const satisfies Primitive<string>

import type { Primitive } from "./primitive"

export const Text = {
	size: (text) => (text?.replace(/\0.*/g, "").length ?? 0) + 1,
	encode: (text, buffer, offset) => {
		buffer.write(text.replace(/\0.*/g, ""), offset, "utf-8")

		return offset + Text.size(text)
	},
	decode: (buffer, offset) => {
		const bytes = []

		for (const byte of buffer.subarray(offset)) {
			// marks the end of the text
			if (byte === 0x00) {
				break
			}

			bytes.push(byte)
		}

		return [Buffer.from(bytes).toString("utf-8"), offset + bytes.length + 1]
	},
} as const satisfies Primitive<string>

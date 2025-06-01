import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import Text from "./text"

describe("Text", () => {
	describe("buffer deserialization", () => {
		it("reads text until null terminator", () => {
			const input = Buffer.from("Hello\0World")
			const result = Text.fromBuffer(input)

			expect(result.toString()).toBe("Hello")
		})

		it("reads text from offset until null terminator", () => {
			const input = Buffer.from("PrefixHello\0World")
			const result = Text.fromBuffer(input, 6)

			expect(result.toString()).toBe("Hello")
		})

		it("handles empty string", () => {
			const input = Buffer.from("\0")
			const result = Text.fromBuffer(input)

			expect(result.toString()).toBe("")
		})

		it("handles string with no null terminator", () => {
			const input = Buffer.from("Hello World")
			const result = Text.fromBuffer(input)

			expect(result.toString()).toBe("Hello World")
		})

		it("handles string with multiple null terminators", () => {
			const input = Buffer.from("Hello\0World\0")
			const result = Text.fromBuffer(input)

			expect(result.toString()).toBe("Hello")
		})

		it("handles string with special characters", () => {
			const input = Buffer.from("Hello\nWorld\0")
			const result = Text.fromBuffer(input)

			expect(result.toString()).toBe("Hello\nWorld")
		})

		it("handles string with unicode characters", () => {
			const input = Buffer.from("Hello 🌍\0World")
			const result = Text.fromBuffer(input)

			expect(result.toString()).toBe("Hello 🌍")
		})
	})
})

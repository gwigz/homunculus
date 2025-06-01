import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import Variable1 from "./variable-1"

describe("Variable1", () => {
	it("has correct prefix size", () => {
		expect(Variable1.prefix).toBe(1)
	})

	describe("buffer serialization", () => {
		it("converts string to buffer", () => {
			const result = Variable1.toBuffer("test")

			expect(result.length).toBe(5) // 1 byte prefix + 4 bytes string
			expect(result[0]).toBe(4) // length prefix
			expect(result.toString("utf8", 1, 5)).toBe("test")
		})

		it("truncates string if too long", () => {
			const longString = "a".repeat(70000)
			const result = Variable1.toBuffer(longString)

			expect(result.length).toBe(256) // 1 byte prefix + 255 bytes string
			expect(result[0]).toBe(255) // length prefix
			expect(result.toString("utf8", 1, 256)).toBe("a".repeat(255))
		})

		it("handles empty string", () => {
			const result = Variable1.toBuffer("")

			expect(result.length).toBe(1) // 1 byte prefix
			expect(result[0]).toBe(0) // length prefix
		})

		it("handles unicode characters", () => {
			const result = Variable1.toBuffer("test 🎮")

			expect(result.length).toBe(10) // 1 byte prefix + 9 bytes string
			expect(result[0]).toBe(9) // length prefix
			expect(result.toString("utf8", 1, 10)).toBe("test 🎮")
		})
	})

	describe("buffer deserialization", () => {
		it("extracts string from buffer", () => {
			const buffer = Buffer.from([4, 116, 101, 115, 116])
			const result = Variable1.fromBuffer(buffer, 0)

			expect(result.toString("utf8")).toBe("test")
		})

		it("extracts string from buffer at offset", () => {
			const buffer = Buffer.from([0, 4, 116, 101, 115, 116])
			const result = Variable1.fromBuffer(buffer, 1)

			expect(result.toString("utf8")).toBe("test")
		})

		it("handles empty string", () => {
			const buffer = Buffer.from([0])
			const result = Variable1.fromBuffer(buffer, 0)

			expect(result.toString("utf8")).toBe("")
		})

		it("handles unicode characters", () => {
			const buffer = Buffer.from([
				9, 116, 101, 115, 116, 32, 240, 159, 142, 174,
			])

			const result = Variable1.fromBuffer(buffer, 0)

			expect(result.toString("utf8")).toBe("test 🎮")
		})
	})
})

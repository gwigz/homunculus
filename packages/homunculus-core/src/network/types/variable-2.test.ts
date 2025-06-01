import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import Variable2 from "./variable-2"

describe("Variable2", () => {
	describe("prefix", () => {
		it("has correct prefix size", () => {
			expect(Variable2.prefix).toBe(2)
		})
	})

	describe("toBuffer", () => {
		it("converts string to length-prefixed buffer", () => {
			const input = "Hello, World!"
			const result = Variable2.toBuffer(input)

			expect(result.length).toBe(input.length + 2) // 2 bytes for length prefix
			expect(result.readUInt16LE(0)).toBe(input.length)
			expect(result.toString("utf-8", 2)).toBe(input)
		})

		it("handles empty string", () => {
			const input = ""
			const result = Variable2.toBuffer(input)

			expect(result.length).toBe(2) // just the length prefix
			expect(result.readUInt16LE(0)).toBe(0)
		})

		it("truncates string longer than 65535 bytes", () => {
			const input = "a".repeat(70000)
			const result = Variable2.toBuffer(input)

			expect(result.length).toBe(65537) // 65535 + 2 bytes for length prefix
			expect(result.readUInt16LE(0)).toBe(65535)
			expect(result.toString("utf-8", 2).length).toBe(65535)
		})

		it("handles string with special characters", () => {
			const input = "Hello, 世界! 🌍"
			const result = Variable2.toBuffer(input)

			expect(result.length).toBe(Buffer.from(input).length + 2)
			expect(result.readUInt16LE(0)).toBe(Buffer.from(input).length)
			expect(result.toString("utf-8", 2)).toBe(input)
		})
	})

	describe("fromBuffer", () => {
		it("extracts string from length-prefixed buffer", () => {
			const input = "Hello, World!"
			const buffer = Buffer.alloc(input.length + 2)

			buffer.writeUInt16LE(input.length, 0)
			buffer.write(input, 2)

			const result = Variable2.fromBuffer(buffer, 0)

			expect(result.toString("utf-8")).toBe(input)
		})

		it("handles empty buffer", () => {
			const buffer = Buffer.alloc(2) // just length prefix

			buffer.writeUInt16LE(0, 0)

			const result = Variable2.fromBuffer(buffer, 0)

			expect(result.length).toBe(0)
		})

		it("extracts string from buffer at offset", () => {
			const input = "Hello, World!"
			const buffer = Buffer.alloc(input.length + 4) // extra space for offset

			buffer.writeUInt16LE(input.length, 2)
			buffer.write(input, 4)

			const result = Variable2.fromBuffer(buffer, 2)

			expect(result.toString("utf-8")).toBe(input)
		})

		it("handles buffer with special characters", () => {
			const input = "Hello, 世界! 🌍"
			const buffer = Buffer.alloc(Buffer.from(input).length + 2)

			buffer.writeUInt16LE(Buffer.from(input).length, 0)
			buffer.write(input, 2)

			const result = Variable2.fromBuffer(buffer, 0)

			expect(result.toString("utf-8")).toBe(input)
		})
	})
})

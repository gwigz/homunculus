import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import Variable2 from "./variable-2"

describe("Variable2", () => {
	describe("prefix", () => {
		test("has correct prefix size", () => {
			expect(Variable2.prefix).toBe(2)
		})
	})

	describe("buffer serialization", () => {
		test("converts string to buffer", () => {
			const value = "Hello, World!"
			const result = Variable2.toBuffer(value)

			expect(result.length).toBe(2 + value.length)
			expect(result.readUInt16LE(0)).toBe(value.length)
			expect(result.toString("utf-8", 2)).toBe(value)
		})

		test("truncates string if too long", () => {
			const value = "a".repeat(70000)
			const result = Variable2.toBuffer(value)

			expect(result.length).toBe(2 + 65535)
			expect(result.readUInt16LE(0)).toBe(65535)
			expect(result.toString("utf-8", 2)).toBe("a".repeat(65535))
		})

		test("handles empty string", () => {
			const value = ""
			const result = Variable2.toBuffer(value)

			expect(result.length).toBe(2)
			expect(result.readUInt16LE(0)).toBe(0)
		})
	})

	describe("buffer deserialization", () => {
		test("extracts string from buffer", () => {
			const value = "Hello, World!"
			const buffer = Variable2.toBuffer(value)
			const result = Variable2.fromBuffer(buffer, 0)

			expect(result.toString("utf-8")).toBe(value)
		})

		test("extracts string from buffer at offset", () => {
			const value = "Hello, World!"
			const buffer = Variable2.toBuffer(value)
			const fullBuffer = Buffer.concat([Buffer.alloc(2), buffer])
			const result = Variable2.fromBuffer(fullBuffer, 2)

			expect(result.toString("utf-8")).toBe(value)
		})

		test("handles empty string", () => {
			const value = ""
			const buffer = Variable2.toBuffer(value)
			const result = Variable2.fromBuffer(buffer, 0)

			expect(result.length).toBe(0)
		})
	})
})

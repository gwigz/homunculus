import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import Variable1 from "./variable-1"

describe("Variable1", () => {
	describe("prefix", () => {
		test("has correct prefix size", () => {
			expect(Variable1.prefix).toBe(1)
		})
	})

	describe("buffer serialization", () => {
		test("converts string to buffer", () => {
			const value = "Hello, World!"
			const result = Variable1.toBuffer(value)

			expect(result.length).toBe(1 + value.length)
			expect(result.readUInt8(0)).toBe(value.length)
			expect(result.toString("utf-8", 1)).toBe(value)
		})

		test("truncates string if too long", () => {
			const value = "a".repeat(300)
			const result = Variable1.toBuffer(value)

			expect(result.length).toBe(1 + 255)
			expect(result.readUInt8(0)).toBe(255)
			expect(result.toString("utf-8", 1)).toBe("a".repeat(255))
		})

		test("handles empty string", () => {
			const value = ""
			const result = Variable1.toBuffer(value)

			expect(result.length).toBe(1)
			expect(result.readUInt8(0)).toBe(0)
		})
	})

	describe("buffer deserialization", () => {
		test("extracts string from buffer", () => {
			const value = "Hello, World!"
			const buffer = Variable1.toBuffer(value)
			const result = Variable1.fromBuffer(buffer)

			expect(result.toString("utf-8")).toBe(value)
		})

		test("extracts string from buffer at offset", () => {
			const value = "Hello, World!"
			const buffer = Variable1.toBuffer(value)
			const fullBuffer = Buffer.concat([Buffer.alloc(2), buffer])
			const result = Variable1.fromBuffer(fullBuffer, 2)

			expect(result.toString("utf-8")).toBe(value)
		})

		test("handles empty string", () => {
			const value = ""
			const buffer = Variable1.toBuffer(value)
			const result = Variable1.fromBuffer(buffer)

			expect(result.length).toBe(0)
		})
	})
})

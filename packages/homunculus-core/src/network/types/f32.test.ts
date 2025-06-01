import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import F32 from "./f32"

describe("F32", () => {
	describe("size", () => {
		test("has correct size", () => {
			expect(F32.size).toBe(4)
		})
	})

	describe("buffer serialization", () => {
		test("converts to buffer with correct float value", () => {
			const value = 1.5
			const buffer = F32.toBuffer(value)

			expect(buffer.length).toBe(F32.size)
			expect(buffer.readFloatLE(0)).toBe(value)
		})

		test("handles zero value", () => {
			const value = 0
			const buffer = F32.toBuffer(value)

			expect(buffer.length).toBe(F32.size)
			expect(buffer.readFloatLE(0)).toBe(value)
		})

		test("handles negative value", () => {
			const value = -1.5
			const buffer = F32.toBuffer(value)

			expect(buffer.length).toBe(F32.size)
			expect(buffer.readFloatLE(0)).toBe(value)
		})
	})

	describe("buffer deserialization", () => {
		test("creates from buffer with correct value", () => {
			const value = 1.5
			const buffer = Buffer.allocUnsafe(F32.size)
			buffer.writeFloatLE(value, 0)

			expect(F32.fromBuffer(buffer)).toBe(value)
		})

		test("creates from buffer with correct value at offset", () => {
			const value = 1.5
			const buffer = Buffer.allocUnsafe(F32.size + 4)
			buffer.writeFloatLE(value, 4)

			expect(F32.fromBuffer(buffer, 4)).toBe(value)
		})

		test("handles zero value", () => {
			const value = 0
			const buffer = Buffer.allocUnsafe(F32.size)
			buffer.writeFloatLE(value, 0)

			expect(F32.fromBuffer(buffer)).toBe(value)
		})

		test("handles negative value", () => {
			const value = -1.5
			const buffer = Buffer.allocUnsafe(F32.size)
			buffer.writeFloatLE(value, 0)

			expect(F32.fromBuffer(buffer)).toBe(value)
		})
	})
})

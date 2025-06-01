import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import F32 from "./f32"

describe("F32", () => {
	describe("size", () => {
		it("has correct size", () => {
			expect(F32.size).toBe(4)
		})
	})

	describe("buffer serialization", () => {
		it("converts to buffer with correct float value", () => {
			const value = 1.5
			const buffer = F32.toBuffer(value)

			expect(buffer.length).toBe(F32.size)
			expect(buffer.readFloatLE(0)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = F32.toBuffer(value)

			expect(buffer.length).toBe(F32.size)
			expect(buffer.readFloatLE(0)).toBe(value)
		})

		it("handles negative value", () => {
			const value = -1.5
			const buffer = F32.toBuffer(value)

			expect(buffer.length).toBe(F32.size)
			expect(buffer.readFloatLE(0)).toBe(value)
		})
	})

	describe("buffer deserialization", () => {
		it("creates from buffer with correct value", () => {
			const value = 1.5
			const buffer = Buffer.allocUnsafe(F32.size)

			buffer.writeFloatLE(value, 0)

			expect(F32.fromBuffer(buffer)).toBe(value)
		})

		it("creates from buffer with correct value at offset", () => {
			const value = 1.5
			const buffer = Buffer.allocUnsafe(F32.size + 4)

			buffer.writeFloatLE(value, 4)

			expect(F32.fromBuffer(buffer, 4)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = Buffer.allocUnsafe(F32.size)

			buffer.writeFloatLE(value, 0)

			expect(F32.fromBuffer(buffer)).toBe(value)
		})

		it("handles negative value", () => {
			const value = -1.5
			const buffer = Buffer.allocUnsafe(F32.size)

			buffer.writeFloatLE(value, 0)

			expect(F32.fromBuffer(buffer)).toBe(value)
		})
	})
})

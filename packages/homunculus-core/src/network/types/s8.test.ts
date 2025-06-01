import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import S8 from "./s8"

describe("S8", () => {
	describe("size", () => {
		it("has correct size", () => {
			expect(S8.size).toBe(1)
		})
	})

	describe("buffer serialization", () => {
		it("converts to buffer with correct value", () => {
			const value = 42
			const buffer = S8.toBuffer(value)

			expect(buffer.length).toBe(S8.size)
			expect(buffer.readInt8(0)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = S8.toBuffer(value)

			expect(buffer.length).toBe(S8.size)
			expect(buffer.readInt8(0)).toBe(value)
		})

		it("handles positive maximum value", () => {
			const value = 127
			const buffer = S8.toBuffer(value)

			expect(buffer.length).toBe(S8.size)
			expect(buffer.readInt8(0)).toBe(value)
		})

		it("handles negative maximum value", () => {
			const value = -128
			const buffer = S8.toBuffer(value)

			expect(buffer.length).toBe(S8.size)
			expect(buffer.readInt8(0)).toBe(value)
		})

		it("clamps values above maximum", () => {
			const value = 128
			const buffer = S8.toBuffer(value)

			expect(buffer.length).toBe(S8.size)
			expect(buffer.readInt8(0)).toBe(-128)
		})

		it("clamps values below minimum", () => {
			const value = -129
			const buffer = S8.toBuffer(value)

			expect(buffer.length).toBe(S8.size)
			expect(buffer.readInt8(0)).toBe(127)
		})
	})

	describe("buffer deserialization", () => {
		it("creates from buffer with correct value", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(S8.size)
			buffer.writeInt8(value, 0)

			expect(S8.fromBuffer(buffer)).toBe(value)
		})

		it("creates from buffer with correct value at offset", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(S8.size + 1)
			buffer.writeInt8(value, 1)

			expect(S8.fromBuffer(buffer, 1)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = Buffer.allocUnsafe(S8.size)
			buffer.writeInt8(value, 0)

			expect(S8.fromBuffer(buffer)).toBe(value)
		})

		it("handles positive maximum value", () => {
			const value = 127
			const buffer = Buffer.allocUnsafe(S8.size)
			buffer.writeInt8(value, 0)

			expect(S8.fromBuffer(buffer)).toBe(value)
		})

		it("handles negative maximum value", () => {
			const value = -128
			const buffer = Buffer.allocUnsafe(S8.size)
			buffer.writeInt8(value, 0)

			expect(S8.fromBuffer(buffer)).toBe(value)
		})
	})
})

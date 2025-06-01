import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import S32 from "./s32"

describe("S32", () => {
	describe("size", () => {
		it("has correct size", () => {
			expect(S32.size).toBe(4)
		})
	})

	describe("buffer serialization", () => {
		it("converts to buffer with correct value", () => {
			const value = 42
			const buffer = S32.toBuffer(value)

			expect(buffer.length).toBe(S32.size)
			expect(buffer.readInt32LE(0)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = S32.toBuffer(value)

			expect(buffer.length).toBe(S32.size)
			expect(buffer.readInt32LE(0)).toBe(value)
		})

		it("handles positive maximum value", () => {
			const value = 2147483647
			const buffer = S32.toBuffer(value)

			expect(buffer.length).toBe(S32.size)
			expect(buffer.readInt32LE(0)).toBe(value)
		})

		it("handles negative maximum value", () => {
			const value = -2147483648
			const buffer = S32.toBuffer(value)

			expect(buffer.length).toBe(S32.size)
			expect(buffer.readInt32LE(0)).toBe(value)
		})

		it("clamps values above maximum", () => {
			const value = 2147483648
			const buffer = S32.toBuffer(value)

			expect(buffer.length).toBe(S32.size)
			expect(buffer.readInt32LE(0)).toBe(-2147483648)
		})

		it("clamps values below minimum", () => {
			const value = -2147483649
			const buffer = S32.toBuffer(value)

			expect(buffer.length).toBe(S32.size)
			expect(buffer.readInt32LE(0)).toBe(2147483647)
		})
	})

	describe("buffer deserialization", () => {
		it("creates from buffer with correct value", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(S32.size)

			buffer.writeInt32LE(value, 0)

			expect(S32.fromBuffer(buffer)).toBe(value)
		})

		it("creates from buffer with correct value at offset", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(S32.size + 2)

			buffer.writeInt32LE(value, 2)

			expect(S32.fromBuffer(buffer, 2)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = Buffer.allocUnsafe(S32.size)

			buffer.writeInt32LE(value, 0)

			expect(S32.fromBuffer(buffer)).toBe(value)
		})

		it("handles positive maximum value", () => {
			const value = 2147483647
			const buffer = Buffer.allocUnsafe(S32.size)

			buffer.writeInt32LE(value, 0)

			expect(S32.fromBuffer(buffer)).toBe(value)
		})

		it("handles negative maximum value", () => {
			const value = -2147483648
			const buffer = Buffer.allocUnsafe(S32.size)

			buffer.writeInt32LE(value, 0)

			expect(S32.fromBuffer(buffer)).toBe(value)
		})
	})
})

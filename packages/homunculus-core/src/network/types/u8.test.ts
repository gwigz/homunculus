import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import U8 from "./u8"

describe("U8", () => {
	describe("size", () => {
		it("has correct size", () => {
			expect(U8.size).toBe(1)
		})
	})

	describe("buffer serialization", () => {
		it("converts to buffer with correct value", () => {
			const value = 42
			const buffer = U8.toBuffer(value)

			expect(buffer.length).toBe(U8.size)
			expect(buffer.readUInt8(0)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = U8.toBuffer(value)

			expect(buffer.length).toBe(U8.size)
			expect(buffer.readUInt8(0)).toBe(value)
		})

		it("handles maximum value", () => {
			const value = 255
			const buffer = U8.toBuffer(value)

			expect(buffer.length).toBe(U8.size)
			expect(buffer.readUInt8(0)).toBe(value)
		})

		it("clamps values above maximum", () => {
			const value = 256
			const buffer = U8.toBuffer(value)

			expect(buffer.length).toBe(U8.size)
			expect(buffer.readUInt8(0)).toBe(0)
		})

		it("clamps negative values", () => {
			const value = -1
			const buffer = U8.toBuffer(value)

			expect(buffer.length).toBe(U8.size)
			expect(buffer.readUInt8(0)).toBe(255)
		})
	})

	describe("buffer deserialization", () => {
		it("creates from buffer with correct value", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(U8.size)

			buffer.writeUInt8(value, 0)

			expect(U8.fromBuffer(buffer)).toBe(value)
		})

		it("creates from buffer with correct value at offset", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(U8.size + 1)

			buffer.writeUInt8(value, 1)

			expect(U8.fromBuffer(buffer, 1)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = Buffer.allocUnsafe(U8.size)

			buffer.writeUInt8(value, 0)

			expect(U8.fromBuffer(buffer)).toBe(value)
		})

		it("handles maximum value", () => {
			const value = 255
			const buffer = Buffer.allocUnsafe(U8.size)

			buffer.writeUInt8(value, 0)

			expect(U8.fromBuffer(buffer)).toBe(value)
		})
	})

	describe("float conversion", () => {
		it("converts to float in range [0,1]", () => {
			expect(U8.toFloat(0, 0, 1)).toBeCloseTo(0.0)
			expect(U8.toFloat(255, 0, 1)).toBeCloseTo(1.0)
			expect(U8.toFloat(127, 0, 1)).toBeCloseTo(0.498, 3)
		})

		it("converts to float in range [-1,1]", () => {
			expect(U8.toFloat(0, -1, 1)).toBeCloseTo(-1.0)
			expect(U8.toFloat(255, -1, 1)).toBeCloseTo(1.0)
			expect(U8.toFloat(127, -1, 1)).toBeCloseTo(0.0)
		})

		it("converts to float in custom range", () => {
			expect(U8.toFloat(0, -256, 256)).toBeCloseTo(-256.0)
			expect(U8.toFloat(255, -256, 256)).toBeCloseTo(256.0)
			expect(U8.toFloat(127, -256, 256)).toBeCloseTo(0.0)
		})

		it("handles reversed range", () => {
			expect(U8.toFloat(0, 1, 0)).toBeCloseTo(1.0)
			expect(U8.toFloat(255, 1, 0)).toBeCloseTo(0.0)
		})

		it("handles very small values", () => {
			expect(U8.toFloat(1, -1, 1)).toBeCloseTo(-0.992, 3)
		})
	})
})

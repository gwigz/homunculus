import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import U16 from "./u16"

describe("U16", () => {
	describe("size", () => {
		it("has correct size", () => {
			expect(U16.size).toBe(2)
		})
	})

	describe("buffer serialization", () => {
		it("converts to buffer with correct value", () => {
			const value = 42
			const buffer = U16.toBuffer(value)

			expect(buffer.length).toBe(U16.size)
			expect(buffer.readUInt16LE(0)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = U16.toBuffer(value)

			expect(buffer.length).toBe(U16.size)
			expect(buffer.readUInt16LE(0)).toBe(value)
		})

		it("handles maximum value", () => {
			const value = 65535
			const buffer = U16.toBuffer(value)

			expect(buffer.length).toBe(U16.size)
			expect(buffer.readUInt16LE(0)).toBe(value)
		})

		it("clamps values above maximum", () => {
			const value = 65536
			const buffer = U16.toBuffer(value)

			expect(buffer.length).toBe(U16.size)
			expect(buffer.readUInt16LE(0)).toBe(0)
		})

		it("clamps negative values", () => {
			const value = -1
			const buffer = U16.toBuffer(value)

			expect(buffer.length).toBe(U16.size)
			expect(buffer.readUInt16LE(0)).toBe(65535)
		})
	})

	describe("buffer deserialization", () => {
		it("creates from buffer with correct value", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(U16.size)
			buffer.writeUInt16LE(value, 0)

			expect(U16.fromBuffer(buffer)).toBe(value)
		})

		it("creates from buffer with correct value at offset", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(U16.size + 2)
			buffer.writeUInt16LE(value, 2)

			expect(U16.fromBuffer(buffer, 2)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = Buffer.allocUnsafe(U16.size)
			buffer.writeUInt16LE(value, 0)

			expect(U16.fromBuffer(buffer)).toBe(value)
		})

		it("handles maximum value", () => {
			const value = 65535
			const buffer = Buffer.allocUnsafe(U16.size)
			buffer.writeUInt16LE(value, 0)

			expect(U16.fromBuffer(buffer)).toBe(value)
		})
	})

	describe("float conversion", () => {
		it("converts to float in range [0,1]", () => {
			expect(U16.toFloat(0, 0, 1)).toBe(0)
			expect(U16.toFloat(32768, 0, 1)).toBeCloseTo(0.5)
			expect(U16.toFloat(65535, 0, 1)).toBeCloseTo(1)
		})

		it("converts to float in range [-1,1]", () => {
			expect(U16.toFloat(0, -1, 1)).toBe(-1)
			expect(U16.toFloat(32768, -1, 1)).toBeCloseTo(0)
			expect(U16.toFloat(65535, -1, 1)).toBeCloseTo(1)
		})

		it("converts to float in custom range", () => {
			expect(U16.toFloat(0, 10, 20)).toBe(10)
			expect(U16.toFloat(32768, 10, 20)).toBeCloseTo(15)
			expect(U16.toFloat(65535, 10, 20)).toBeCloseTo(20)
		})

		it("handles reversed range", () => {
			expect(U16.toFloat(0, 20, 10)).toBe(20)
			expect(U16.toFloat(32768, 20, 10)).toBeCloseTo(15)
			expect(U16.toFloat(65535, 20, 10)).toBeCloseTo(10)
		})
	})
})

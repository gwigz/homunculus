import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import F64 from "./f64"

describe("F64", () => {
	describe("size", () => {
		it("has correct size", () => {
			expect(F64.size).toBe(8)
		})
	})

	describe("buffer serialization", () => {
		it("converts to buffer with correct double value", () => {
			const value = 1.5
			const buffer = F64.toBuffer(value)

			expect(buffer.length).toBe(F64.size)
			expect(buffer.readDoubleLE(0)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = F64.toBuffer(value)

			expect(buffer.length).toBe(F64.size)
			expect(buffer.readDoubleLE(0)).toBe(value)
		})

		it("handles negative value", () => {
			const value = -1.5
			const buffer = F64.toBuffer(value)

			expect(buffer.length).toBe(F64.size)
			expect(buffer.readDoubleLE(0)).toBe(value)
		})

		it("handles large value", () => {
			const value = Number.MAX_SAFE_INTEGER
			const buffer = F64.toBuffer(value)

			expect(buffer.length).toBe(F64.size)
			expect(buffer.readDoubleLE(0)).toBe(value)
		})
	})

	describe("buffer deserialization", () => {
		it("creates from buffer with correct value", () => {
			const value = 1.5
			const buffer = Buffer.allocUnsafe(F64.size)
			buffer.writeDoubleLE(value, 0)

			expect(F64.fromBuffer(buffer)).toBe(value)
		})

		it("creates from buffer with correct value at offset", () => {
			const value = 1.5
			const buffer = Buffer.allocUnsafe(F64.size + 8)
			buffer.writeDoubleLE(value, 8)

			expect(F64.fromBuffer(buffer, 8)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = Buffer.allocUnsafe(F64.size)
			buffer.writeDoubleLE(value, 0)

			expect(F64.fromBuffer(buffer)).toBe(value)
		})

		it("handles negative value", () => {
			const value = -1.5
			const buffer = Buffer.allocUnsafe(F64.size)
			buffer.writeDoubleLE(value, 0)

			expect(F64.fromBuffer(buffer)).toBe(value)
		})

		it("handles large value", () => {
			const value = Number.MAX_SAFE_INTEGER
			const buffer = Buffer.allocUnsafe(F64.size)
			buffer.writeDoubleLE(value, 0)

			expect(F64.fromBuffer(buffer)).toBe(value)
		})
	})
})

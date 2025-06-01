import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import Fixed4 from "./fixed-4"

describe("Fixed4", () => {
	describe("size", () => {
		it("has correct size", () => {
			expect(Fixed4.size).toBe(4)
		})
	})

	describe("buffer serialization", () => {
		it("returns same buffer if size matches", () => {
			const buffer = Buffer.alloc(4, 1)
			const result = Fixed4.toBuffer(buffer)

			expect(result).toBe(buffer)
			expect(result.length).toBe(4)
		})

		it("truncates buffer if too large", () => {
			const buffer = Buffer.alloc(8, 1)
			const result = Fixed4.toBuffer(buffer)

			expect(result).not.toBe(buffer)
			expect(result.length).toBe(4)
			expect(result.every((byte) => byte === 1)).toBe(true)
		})

		it("pads buffer if too small", () => {
			const buffer = Buffer.alloc(2, 1)
			const result = Fixed4.toBuffer(buffer)

			expect(result).not.toBe(buffer)
			expect(result.length).toBe(4)
			expect(result.subarray(0, 2).every((byte) => byte === 1)).toBe(true)
			expect(result.subarray(2).every((byte) => byte === 0)).toBe(true)
		})
	})

	describe("buffer deserialization", () => {
		it("extracts correct bytes from buffer", () => {
			const buffer = Buffer.alloc(8)

			buffer.fill(1, 0, 4)
			buffer.fill(2, 4)

			const result = Fixed4.fromBuffer(buffer, 0)

			expect(result.length).toBe(4)
			expect(result.every((byte) => byte === 1)).toBe(true)
		})

		it("extracts correct bytes from buffer at offset", () => {
			const buffer = Buffer.alloc(8)

			buffer.fill(1, 0, 4)
			buffer.fill(2, 4)

			const result = Fixed4.fromBuffer(buffer, 4)

			expect(result.length).toBe(4)
			expect(result.every((byte) => byte === 2)).toBe(true)
		})
	})
})

import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import Fixed32 from "./fixed-32"

describe("Fixed32", () => {
	describe("size", () => {
		it("has correct size", () => {
			expect(Fixed32.size).toBe(32)
		})
	})

	describe("buffer serialization", () => {
		it("returns same buffer if size matches", () => {
			const buffer = Buffer.alloc(32, 1)
			const result = Fixed32.toBuffer(buffer)

			expect(result).toBe(buffer)
			expect(result.length).toBe(32)
		})

		it("truncates buffer if too large", () => {
			const buffer = Buffer.alloc(40, 1)
			const result = Fixed32.toBuffer(buffer)

			expect(result).not.toBe(buffer)
			expect(result.length).toBe(32)
			expect(result.every((byte) => byte === 1)).toBe(true)
		})

		it("pads buffer if too small", () => {
			const buffer = Buffer.alloc(16, 1)
			const result = Fixed32.toBuffer(buffer)

			expect(result).not.toBe(buffer)
			expect(result.length).toBe(32)
			expect(result.subarray(0, 16).every((byte) => byte === 1)).toBe(true)
			expect(result.subarray(16).every((byte) => byte === 0)).toBe(true)
		})
	})

	describe("buffer deserialization", () => {
		it("extracts correct bytes from buffer", () => {
			const buffer = Buffer.alloc(64)

			buffer.fill(1, 0, 32)
			buffer.fill(2, 32)

			const result = Fixed32.fromBuffer(buffer, 0)

			expect(result.length).toBe(32)
			expect(result.every((byte) => byte === 1)).toBe(true)
		})

		it("extracts correct bytes from buffer at offset", () => {
			const buffer = Buffer.alloc(64)

			buffer.fill(1, 0, 32)
			buffer.fill(2, 32)

			const result = Fixed32.fromBuffer(buffer, 32)

			expect(result.length).toBe(32)
			expect(result.every((byte) => byte === 2)).toBe(true)
		})
	})
})

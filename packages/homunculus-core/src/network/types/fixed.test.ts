import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import Fixed4 from "./fixed-4"
import Fixed32 from "./fixed-32"

describe("Fixed4", () => {
	describe("size", () => {
		test("has correct size", () => {
			expect(Fixed4.size).toBe(4)
		})
	})

	describe("buffer serialization", () => {
		test("returns same buffer if size matches", () => {
			const buffer = Buffer.from([1, 2, 3, 4])
			const result = Fixed4.toBuffer(buffer)

			expect(result).toBe(buffer)
			expect(result.length).toBe(Fixed4.size)
			expect(result[0]).toBe(1)
			expect(result[1]).toBe(2)
			expect(result[2]).toBe(3)
			expect(result[3]).toBe(4)
		})

		test("truncates buffer if too large", () => {
			const buffer = Buffer.from([1, 2, 3, 4, 5, 6])
			const result = Fixed4.toBuffer(buffer)

			expect(result.length).toBe(Fixed4.size)
			expect(result[0]).toBe(1)
			expect(result[1]).toBe(2)
			expect(result[2]).toBe(3)
			expect(result[3]).toBe(4)
		})

		test("pads buffer if too small", () => {
			const buffer = Buffer.from([1, 2])
			const result = Fixed4.toBuffer(buffer)

			expect(result.length).toBe(Fixed4.size)
			expect(result[0]).toBe(1)
			expect(result[1]).toBe(2)
			expect(result[2]).toBe(0)
			expect(result[3]).toBe(0)
		})
	})

	describe("buffer deserialization", () => {
		test("extracts correct bytes from buffer", () => {
			const buffer = Buffer.from([1, 2, 3, 4, 5, 6])
			const result = Fixed4.fromBuffer(buffer, 1)

			expect(result.length).toBe(Fixed4.size)
			expect(result[0]).toBe(2)
			expect(result[1]).toBe(3)
			expect(result[2]).toBe(4)
			expect(result[3]).toBe(5)
		})
	})
})

describe("Fixed32", () => {
	describe("size", () => {
		test("has correct size", () => {
			expect(Fixed32.size).toBe(32)
		})
	})

	describe("buffer serialization", () => {
		test("returns same buffer if size matches", () => {
			const buffer = Buffer.alloc(Fixed32.size)
			for (let i = 0; i < Fixed32.size; i++) {
				buffer[i] = i + 1
			}
			const result = Fixed32.toBuffer(buffer)

			expect(result).toBe(buffer)
			expect(result.length).toBe(Fixed32.size)
			for (let i = 0; i < Fixed32.size; i++) {
				expect(result[i]).toBe(i + 1)
			}
		})

		test("truncates buffer if too large", () => {
			const buffer = Buffer.alloc(Fixed32.size + 4)
			for (let i = 0; i < buffer.length; i++) {
				buffer[i] = i + 1
			}
			const result = Fixed32.toBuffer(buffer)

			expect(result.length).toBe(Fixed32.size)
			for (let i = 0; i < Fixed32.size; i++) {
				expect(result[i]).toBe(i + 1)
			}
		})

		test("pads buffer if too small", () => {
			const buffer = Buffer.from([1, 2])
			const result = Fixed32.toBuffer(buffer)

			expect(result.length).toBe(Fixed32.size)
			expect(result[0]).toBe(1)
			expect(result[1]).toBe(2)
			for (let i = 2; i < Fixed32.size; i++) {
				expect(result[i]).toBe(0)
			}
		})
	})

	describe("buffer deserialization", () => {
		test("extracts correct bytes from buffer", () => {
			const buffer = Buffer.alloc(Fixed32.size + 4)
			for (let i = 0; i < buffer.length; i++) {
				buffer[i] = i + 1
			}
			const result = Fixed32.fromBuffer(buffer, 2)

			expect(result.length).toBe(Fixed32.size)
			for (let i = 0; i < Fixed32.size; i++) {
				expect(result[i]).toBe(i + 3)
			}
		})
	})
})

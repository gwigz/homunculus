import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import U64 from "./u64"

describe("U64", () => {
	describe("size", () => {
		test("has correct size", () => {
			expect(U64.size).toBe(8)
		})
	})

	describe("buffer serialization", () => {
		test("converts number to buffer", () => {
			const value = 42
			const buffer = U64.toBuffer(value)

			expect(buffer.length).toBe(U64.size)
			expect(U64.fromBuffer(buffer)).toBe(BigInt(value))
		})

		test("converts BigInt to buffer", () => {
			const value = 42n
			const buffer = U64.toBuffer(value)

			expect(buffer.length).toBe(U64.size)
			expect(U64.fromBuffer(buffer)).toBe(value)
		})

		test("handles zero value", () => {
			const value = 0n
			const buffer = U64.toBuffer(value)

			expect(buffer.length).toBe(U64.size)
			expect(U64.fromBuffer(buffer)).toBe(value)
		})

		test("handles maximum value", () => {
			const value = 0xffffffffffffffffn
			const buffer = U64.toBuffer(value)

			expect(buffer.length).toBe(U64.size)
			expect(U64.fromBuffer(buffer)).toBe(value)
		})

		test("handles large values", () => {
			const value = 0x1234567890abcdefn
			const buffer = U64.toBuffer(value)

			expect(buffer.length).toBe(U64.size)
			expect(U64.fromBuffer(buffer)).toBe(value)
		})
	})

	describe("buffer deserialization", () => {
		test("creates from buffer with correct value", () => {
			const value = 42n
			const buffer = Buffer.allocUnsafe(U64.size)
			U64.toBuffer(value).copy(buffer)

			expect(U64.fromBuffer(buffer)).toBe(value)
		})

		test("creates from buffer with correct value at offset", () => {
			const value = 42n
			const buffer = Buffer.allocUnsafe(U64.size + 8)
			U64.toBuffer(value).copy(buffer, 8)

			expect(U64.fromBuffer(buffer, 8)).toBe(value)
		})

		test("handles zero value", () => {
			const value = 0n
			const buffer = Buffer.allocUnsafe(U64.size)
			U64.toBuffer(value).copy(buffer)

			expect(U64.fromBuffer(buffer)).toBe(value)
		})

		test("handles maximum value", () => {
			const value = 0xffffffffffffffffn
			const buffer = Buffer.allocUnsafe(U64.size)
			U64.toBuffer(value).copy(buffer)

			expect(U64.fromBuffer(buffer)).toBe(value)
		})

		test("handles large values", () => {
			const value = 0x1234567890abcdefn
			const buffer = Buffer.allocUnsafe(U64.size)
			U64.toBuffer(value).copy(buffer)

			expect(U64.fromBuffer(buffer)).toBe(value)
		})
	})
})

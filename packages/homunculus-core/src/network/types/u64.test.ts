import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import U64 from "./u64"

describe("U64", () => {
	describe("size", () => {
		it("has correct size", () => {
			expect(U64.size).toBe(8)
		})
	})

	describe("buffer serialization", () => {
		it("converts number to buffer", () => {
			const value = 42
			const buffer = U64.toBuffer(value)

			expect(buffer.length).toBe(U64.size)
			expect(U64.fromBuffer(buffer)).toBe(BigInt(value))
		})

		it("converts BigInt to buffer", () => {
			const value = 42n
			const buffer = U64.toBuffer(value)

			expect(buffer.length).toBe(U64.size)
			expect(U64.fromBuffer(buffer)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0n
			const buffer = U64.toBuffer(value)

			expect(buffer.length).toBe(U64.size)
			expect(U64.fromBuffer(buffer)).toBe(value)
		})

		it("handles maximum value", () => {
			const value = 0xffffffffffffffffn
			const buffer = U64.toBuffer(value)

			expect(buffer.length).toBe(U64.size)
			expect(U64.fromBuffer(buffer)).toBe(value)
		})

		it("handles large values", () => {
			const value = 0x1234567890abcdefn
			const buffer = U64.toBuffer(value)

			expect(buffer.length).toBe(U64.size)
			expect(U64.fromBuffer(buffer)).toBe(value)
		})
	})

	describe("buffer deserialization", () => {
		it("creates from buffer with correct value", () => {
			const value = 42n
			const buffer = Buffer.allocUnsafe(U64.size)
			U64.toBuffer(value).copy(buffer)

			expect(U64.fromBuffer(buffer)).toBe(value)
		})

		it("creates from buffer with correct value at offset", () => {
			const value = 42n
			const buffer = Buffer.allocUnsafe(U64.size + 8)
			U64.toBuffer(value).copy(buffer, 8)

			expect(U64.fromBuffer(buffer, 8)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0n
			const buffer = Buffer.allocUnsafe(U64.size)
			U64.toBuffer(value).copy(buffer)

			expect(U64.fromBuffer(buffer)).toBe(value)
		})

		it("handles maximum value", () => {
			const value = 0xffffffffffffffffn
			const buffer = Buffer.allocUnsafe(U64.size)
			U64.toBuffer(value).copy(buffer)

			expect(U64.fromBuffer(buffer)).toBe(value)
		})

		it("handles large values", () => {
			const value = 0x1234567890abcdefn
			const buffer = Buffer.allocUnsafe(U64.size)
			U64.toBuffer(value).copy(buffer)

			expect(U64.fromBuffer(buffer)).toBe(value)
		})
	})
})

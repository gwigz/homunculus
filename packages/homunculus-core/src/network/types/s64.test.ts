import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import S64 from "./s64"

describe("S64", () => {
	describe("size", () => {
		test("has correct size", () => {
			expect(S64.size).toBe(8)
		})
	})

	describe("buffer serialization", () => {
		test("converts number to buffer with correct value", () => {
			const value = 42
			const buffer = S64.toBuffer(value)

			expect(buffer.length).toBe(S64.size)
			expect(buffer.readBigInt64LE(0)).toBe(BigInt(value))
		})

		test("converts bigint to buffer with correct value", () => {
			const value = BigInt(42)
			const buffer = S64.toBuffer(value)

			expect(buffer.length).toBe(S64.size)
			expect(buffer.readBigInt64LE(0)).toBe(value)
		})

		test("handles zero value", () => {
			const value = 0
			const buffer = S64.toBuffer(value)

			expect(buffer.length).toBe(S64.size)
			expect(buffer.readBigInt64LE(0)).toBe(BigInt(value))
		})

		test("handles positive maximum value", () => {
			const value = BigInt("9223372036854775807")
			const buffer = S64.toBuffer(value)

			expect(buffer.length).toBe(S64.size)
			expect(buffer.readBigInt64LE(0)).toBe(value)
		})

		test("handles negative maximum value", () => {
			const value = BigInt("-9223372036854775808")
			const buffer = S64.toBuffer(value)

			expect(buffer.length).toBe(S64.size)
			expect(buffer.readBigInt64LE(0)).toBe(value)
		})

		test("clamps values above maximum", () => {
			const value = BigInt("9223372036854775808")
			const buffer = S64.toBuffer(value)

			expect(buffer.length).toBe(S64.size)
			expect(buffer.readBigInt64LE(0)).toBe(BigInt("-9223372036854775808"))
		})

		test("clamps values below minimum", () => {
			const value = BigInt("-9223372036854775809")
			const buffer = S64.toBuffer(value)

			expect(buffer.length).toBe(S64.size)
			expect(buffer.readBigInt64LE(0)).toBe(BigInt("9223372036854775807"))
		})
	})

	describe("buffer deserialization", () => {
		test("creates from buffer with correct value", () => {
			const value = BigInt(42)
			const buffer = Buffer.allocUnsafe(S64.size)
			buffer.writeBigInt64LE(value, 0)

			expect(S64.fromBuffer(buffer)).toBe(value)
		})

		test("creates from buffer with correct value at offset", () => {
			const value = BigInt(42)
			const buffer = Buffer.allocUnsafe(S64.size + 2)
			buffer.writeBigInt64LE(value, 2)

			expect(S64.fromBuffer(buffer, 2)).toBe(value)
		})

		test("handles zero value", () => {
			const value = BigInt(0)
			const buffer = Buffer.allocUnsafe(S64.size)
			buffer.writeBigInt64LE(value, 0)

			expect(S64.fromBuffer(buffer)).toBe(value)
		})

		test("handles positive maximum value", () => {
			const value = BigInt("9223372036854775807")
			const buffer = Buffer.allocUnsafe(S64.size)
			buffer.writeBigInt64LE(value, 0)

			expect(S64.fromBuffer(buffer)).toBe(value)
		})

		test("handles negative maximum value", () => {
			const value = BigInt("-9223372036854775808")
			const buffer = Buffer.allocUnsafe(S64.size)
			buffer.writeBigInt64LE(value, 0)

			expect(S64.fromBuffer(buffer)).toBe(value)
		})
	})
})

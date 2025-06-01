import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import U32 from "./u32"

describe("U32", () => {
	describe("size", () => {
		test("has correct size", () => {
			expect(U32.size).toBe(4)
		})
	})

	describe("buffer serialization", () => {
		test("converts to buffer with correct value", () => {
			const value = 42
			const buffer = U32.toBuffer(value)

			expect(buffer.length).toBe(U32.size)
			expect(buffer.readUInt32LE(0)).toBe(value)
		})

		test("handles zero value", () => {
			const value = 0
			const buffer = U32.toBuffer(value)

			expect(buffer.length).toBe(U32.size)
			expect(buffer.readUInt32LE(0)).toBe(value)
		})

		test("handles maximum value", () => {
			const value = 4294967295
			const buffer = U32.toBuffer(value)

			expect(buffer.length).toBe(U32.size)
			expect(buffer.readUInt32LE(0)).toBe(value)
		})

		test("clamps values above maximum", () => {
			const value = 4294967296
			const buffer = U32.toBuffer(value)

			expect(buffer.length).toBe(U32.size)
			expect(buffer.readUInt32LE(0)).toBe(0)
		})

		test("clamps negative values", () => {
			const value = -1
			const buffer = U32.toBuffer(value)

			expect(buffer.length).toBe(U32.size)
			expect(buffer.readUInt32LE(0)).toBe(4294967295)
		})
	})

	describe("buffer deserialization", () => {
		test("creates from buffer with correct value", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(U32.size)
			buffer.writeUInt32LE(value, 0)

			expect(U32.fromBuffer(buffer)).toBe(value)
		})

		test("creates from buffer with correct value at offset", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(U32.size + 4)
			buffer.writeUInt32LE(value, 4)

			expect(U32.fromBuffer(buffer, 4)).toBe(value)
		})

		test("handles zero value", () => {
			const value = 0
			const buffer = Buffer.allocUnsafe(U32.size)
			buffer.writeUInt32LE(value, 0)

			expect(U32.fromBuffer(buffer)).toBe(value)
		})

		test("handles maximum value", () => {
			const value = 4294967295
			const buffer = Buffer.allocUnsafe(U32.size)
			buffer.writeUInt32LE(value, 0)

			expect(U32.fromBuffer(buffer)).toBe(value)
		})
	})
})

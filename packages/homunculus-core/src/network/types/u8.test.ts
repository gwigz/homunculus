import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import U8 from "./u8"

describe("U8", () => {
	describe("size", () => {
		test("has correct size", () => {
			expect(U8.size).toBe(1)
		})
	})

	describe("buffer serialization", () => {
		test("converts to buffer with correct value", () => {
			const value = 42
			const buffer = U8.toBuffer(value)

			expect(buffer.length).toBe(U8.size)
			expect(buffer.readUInt8(0)).toBe(value)
		})

		test("handles zero value", () => {
			const value = 0
			const buffer = U8.toBuffer(value)

			expect(buffer.length).toBe(U8.size)
			expect(buffer.readUInt8(0)).toBe(value)
		})

		test("handles maximum value", () => {
			const value = 255
			const buffer = U8.toBuffer(value)

			expect(buffer.length).toBe(U8.size)
			expect(buffer.readUInt8(0)).toBe(value)
		})

		test("clamps values above maximum", () => {
			const value = 256
			const buffer = U8.toBuffer(value)

			expect(buffer.length).toBe(U8.size)
			expect(buffer.readUInt8(0)).toBe(0)
		})

		test("clamps negative values", () => {
			const value = -1
			const buffer = U8.toBuffer(value)

			expect(buffer.length).toBe(U8.size)
			expect(buffer.readUInt8(0)).toBe(255)
		})
	})

	describe("buffer deserialization", () => {
		test("creates from buffer with correct value", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(U8.size)
			buffer.writeUInt8(value, 0)

			expect(U8.fromBuffer(buffer)).toBe(value)
		})

		test("creates from buffer with correct value at offset", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(U8.size + 1)
			buffer.writeUInt8(value, 1)

			expect(U8.fromBuffer(buffer, 1)).toBe(value)
		})

		test("handles zero value", () => {
			const value = 0
			const buffer = Buffer.allocUnsafe(U8.size)
			buffer.writeUInt8(value, 0)

			expect(U8.fromBuffer(buffer)).toBe(value)
		})

		test("handles maximum value", () => {
			const value = 255
			const buffer = Buffer.allocUnsafe(U8.size)
			buffer.writeUInt8(value, 0)

			expect(U8.fromBuffer(buffer)).toBe(value)
		})
	})
})

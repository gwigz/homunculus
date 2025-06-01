import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import S16 from "./s16"

describe("S16", () => {
	describe("size", () => {
		it("has correct size", () => {
			expect(S16.size).toBe(2)
		})
	})

	describe("buffer serialization", () => {
		it("converts to buffer with correct value", () => {
			const value = 42
			const buffer = S16.toBuffer(value)

			expect(buffer.length).toBe(S16.size)
			expect(buffer.readInt16LE(0)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = S16.toBuffer(value)

			expect(buffer.length).toBe(S16.size)
			expect(buffer.readInt16LE(0)).toBe(value)
		})

		it("handles positive maximum value", () => {
			const value = 32767
			const buffer = S16.toBuffer(value)

			expect(buffer.length).toBe(S16.size)
			expect(buffer.readInt16LE(0)).toBe(value)
		})

		it("handles negative maximum value", () => {
			const value = -32768
			const buffer = S16.toBuffer(value)

			expect(buffer.length).toBe(S16.size)
			expect(buffer.readInt16LE(0)).toBe(value)
		})

		it("clamps values above maximum", () => {
			const value = 32768
			const buffer = S16.toBuffer(value)

			expect(buffer.length).toBe(S16.size)
			expect(buffer.readInt16LE(0)).toBe(-32768)
		})

		it("clamps values below minimum", () => {
			const value = -32769
			const buffer = S16.toBuffer(value)

			expect(buffer.length).toBe(S16.size)
			expect(buffer.readInt16LE(0)).toBe(32767)
		})
	})

	describe("buffer deserialization", () => {
		it("creates from buffer with correct value", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(S16.size)

			buffer.writeInt16LE(value, 0)

			expect(S16.fromBuffer(buffer)).toBe(value)
		})

		it("creates from buffer with correct value at offset", () => {
			const value = 42
			const buffer = Buffer.allocUnsafe(S16.size + 2)

			buffer.writeInt16LE(value, 2)

			expect(S16.fromBuffer(buffer, 2)).toBe(value)
		})

		it("handles zero value", () => {
			const value = 0
			const buffer = Buffer.allocUnsafe(S16.size)
			buffer.writeInt16LE(value, 0)

			expect(S16.fromBuffer(buffer)).toBe(value)
		})

		it("handles positive maximum value", () => {
			const value = 32767
			const buffer = Buffer.allocUnsafe(S16.size)

			buffer.writeInt16LE(value, 0)

			expect(S16.fromBuffer(buffer)).toBe(value)
		})

		it("handles negative maximum value", () => {
			const value = -32768
			const buffer = Buffer.allocUnsafe(S16.size)

			buffer.writeInt16LE(value, 0)

			expect(S16.fromBuffer(buffer)).toBe(value)
		})
	})
})

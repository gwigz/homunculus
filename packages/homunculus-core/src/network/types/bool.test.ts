import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import Bool from "./bool"

describe("Bool", () => {
	describe("size", () => {
		it("has correct size", () => {
			expect(Bool.size).toBe(1)
		})
	})

	describe("buffer serialization", () => {
		it("converts true to buffer", () => {
			const buffer = Bool.toBuffer(true)

			expect(buffer.length).toBe(Bool.size)
			expect(buffer.readUInt8(0)).toBe(1)
		})

		it("converts false to buffer", () => {
			const buffer = Bool.toBuffer(false)

			expect(buffer.length).toBe(Bool.size)
			expect(buffer.readUInt8(0)).toBe(0)
		})

		it("converts number 1 to true", () => {
			const buffer = Bool.toBuffer(1)

			expect(buffer.length).toBe(Bool.size)
			expect(buffer.readUInt8(0)).toBe(1)
		})

		it("converts number 0 to false", () => {
			const buffer = Bool.toBuffer(0)

			expect(buffer.length).toBe(Bool.size)
			expect(buffer.readUInt8(0)).toBe(0)
		})

		it("converts non-zero number to true", () => {
			const buffer = Bool.toBuffer(42)

			expect(buffer.length).toBe(Bool.size)
			expect(buffer.readUInt8(0)).toBe(1)
		})
	})

	describe("buffer deserialization", () => {
		it("creates true from buffer", () => {
			const buffer = Buffer.alloc(Bool.size)

			buffer.writeUInt8(1, 0)

			expect(Bool.fromBuffer(buffer)).toBe(true)
		})

		it("creates false from buffer", () => {
			const buffer = Buffer.alloc(Bool.size)

			buffer.writeUInt8(0, 0)

			expect(Bool.fromBuffer(buffer)).toBe(false)
		})

		it("creates true from buffer at offset", () => {
			const buffer = Buffer.alloc(Bool.size + 1)

			buffer.writeUInt8(1, 1)

			expect(Bool.fromBuffer(buffer, 1)).toBe(true)
		})

		it("creates false from buffer at offset", () => {
			const buffer = Buffer.alloc(Bool.size + 1)

			buffer.writeUInt8(0, 1)

			expect(Bool.fromBuffer(buffer, 1)).toBe(false)
		})

		it("converts non-zero value to true", () => {
			const buffer = Buffer.alloc(Bool.size)

			buffer.writeUInt8(42, 0)

			expect(Bool.fromBuffer(buffer)).toBe(true)
		})
	})
})

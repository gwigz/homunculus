import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import Color4 from "./color-4"

describe("Color4", () => {
	describe("size", () => {
		it("has correct size", () => {
			expect(Color4.size).toBe(4)
		})
	})

	describe("zero", () => {
		it("has correct zero values", () => {
			expect(Color4.zero.r).toBe(0)
			expect(Color4.zero.g).toBe(0)
			expect(Color4.zero.b).toBe(0)
			expect(Color4.zero.a).toBe(0)
		})
	})

	describe("toString", () => {
		it("returns correct string representation", () => {
			const color = new Color4(255, 128, 64, 32)

			expect(Color4.toString(color)).toBe("<255, 128, 64, 32>")
		})
	})

	describe("buffer serialization", () => {
		it("converts Color4 instance to buffer", () => {
			const color = new Color4(255, 128, 64, 32)
			const buffer = Color4.toBuffer(color)

			expect(buffer.length).toBe(Color4.size)
			expect(buffer.readUInt8(0)).toBe(255)
			expect(buffer.readUInt8(1)).toBe(128)
			expect(buffer.readUInt8(2)).toBe(64)
			expect(buffer.readUInt8(3)).toBe(32)
		})

		it("converts array to buffer", () => {
			const color = [255, 128, 64, 32] as [number, number, number, number]
			const buffer = Color4.toBuffer(color)

			expect(buffer.length).toBe(Color4.size)
			expect(buffer.readUInt8(0)).toBe(255)
			expect(buffer.readUInt8(1)).toBe(128)
			expect(buffer.readUInt8(2)).toBe(64)
			expect(buffer.readUInt8(3)).toBe(32)
		})

		it("handles missing array values", () => {
			const color = [255, 0, 64, 32] as [number, number, number, number]
			const buffer = Color4.toBuffer(color)

			expect(buffer.length).toBe(Color4.size)
			expect(buffer.readUInt8(0)).toBe(255)
			expect(buffer.readUInt8(1)).toBe(0)
			expect(buffer.readUInt8(2)).toBe(64)
			expect(buffer.readUInt8(3)).toBe(32)
		})

		it("handles zero color", () => {
			const buffer = Color4.toBuffer(Color4.zero)

			expect(buffer.length).toBe(Color4.size)
			expect(buffer.readUInt8(0)).toBe(0)
			expect(buffer.readUInt8(1)).toBe(0)
			expect(buffer.readUInt8(2)).toBe(0)
			expect(buffer.readUInt8(3)).toBe(0)
		})
	})

	describe("buffer deserialization", () => {
		it("creates from buffer with correct values", () => {
			const buffer = Buffer.allocUnsafe(Color4.size)

			buffer.writeUInt8(255, 0)
			buffer.writeUInt8(128, 1)
			buffer.writeUInt8(64, 2)
			buffer.writeUInt8(32, 3)

			const color = Color4.fromBuffer(buffer)

			expect(color.r).toBe(255)
			expect(color.g).toBe(128)
			expect(color.b).toBe(64)
			expect(color.a).toBe(32)
		})

		it("creates from buffer with correct values at offset", () => {
			const buffer = Buffer.allocUnsafe(Color4.size + 2)

			buffer.writeUInt8(255, 2)
			buffer.writeUInt8(128, 3)
			buffer.writeUInt8(64, 4)
			buffer.writeUInt8(32, 5)

			const color = Color4.fromBuffer(buffer, 2)

			expect(color.r).toBe(255)
			expect(color.g).toBe(128)
			expect(color.b).toBe(64)
			expect(color.a).toBe(32)
		})

		it("handles zero values", () => {
			const buffer = Buffer.allocUnsafe(Color4.size)

			buffer.writeUInt8(0, 0)
			buffer.writeUInt8(0, 1)
			buffer.writeUInt8(0, 2)
			buffer.writeUInt8(0, 3)

			const color = Color4.fromBuffer(buffer)

			expect(color.r).toBe(0)
			expect(color.g).toBe(0)
			expect(color.b).toBe(0)
			expect(color.a).toBe(0)
		})
	})
})

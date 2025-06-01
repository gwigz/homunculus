import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import Vector4 from "./vector-4"

describe("Vector4", () => {
	describe("construction and basic properties", () => {
		it("creates vector with correct x, y, z, w values", () => {
			const vector = new Vector4(1, 2, 3, 4)

			expect(vector.x).toBe(1)
			expect(vector.y).toBe(2)
			expect(vector.z).toBe(3)
			expect(vector.w).toBe(4)
		})

		it("has correct static properties", () => {
			expect(Vector4.size).toBe(16)
			expect(Vector4.zero.x).toBe(0)
			expect(Vector4.zero.y).toBe(0)
			expect(Vector4.zero.z).toBe(0)
			expect(Vector4.zero.w).toBe(0)
		})
	})

	describe("string representation", () => {
		it("formats as <x, y, z, w>", () => {
			const vector = new Vector4(1, 2, 3, 4)

			expect(Vector4.toString(vector)).toBe("<1, 2, 3, 4>")
		})
	})

	describe("buffer serialization", () => {
		it("converts to buffer with correct float values", () => {
			const vector = new Vector4(1.5, 2.5, 3.5, 4.5)
			const buffer = Vector4.toBuffer(vector)

			expect(buffer.length).toBe(Vector4.size)
			expect(buffer.readFloatLE(0)).toBe(1.5)
			expect(buffer.readFloatLE(4)).toBe(2.5)
			expect(buffer.readFloatLE(8)).toBe(3.5)
			expect(buffer.readFloatLE(12)).toBe(4.5)
		})

		it("converts array to buffer with correct float values", () => {
			const array: [number, number, number, number] = [1.5, 2.5, 3.5, 4.5]
			const buffer = Vector4.toBuffer(array)

			expect(buffer.length).toBe(Vector4.size)
			expect(buffer.readFloatLE(0)).toBe(1.5)
			expect(buffer.readFloatLE(4)).toBe(2.5)
			expect(buffer.readFloatLE(8)).toBe(3.5)
			expect(buffer.readFloatLE(12)).toBe(4.5)
		})

		it("creates from buffer with correct values", () => {
			const buffer = Buffer.allocUnsafe(Vector4.size)

			buffer.writeFloatLE(1.5, 0)
			buffer.writeFloatLE(2.5, 4)
			buffer.writeFloatLE(3.5, 8)
			buffer.writeFloatLE(4.5, 12)

			const vector = Vector4.fromBuffer(buffer)

			expect(vector.x).toBe(1.5)
			expect(vector.y).toBe(2.5)
			expect(vector.z).toBe(3.5)
			expect(vector.w).toBe(4.5)
		})

		it("creates from buffer with offset position", () => {
			const buffer = Buffer.allocUnsafe(Vector4.size + 4) // Extra space before vector

			buffer.writeFloatLE(1.5, 4)
			buffer.writeFloatLE(2.5, 8)
			buffer.writeFloatLE(3.5, 12)
			buffer.writeFloatLE(4.5, 16)

			const vector = Vector4.fromBuffer(buffer, 4)

			expect(vector.x).toBe(1.5)
			expect(vector.y).toBe(2.5)
			expect(vector.z).toBe(3.5)
			expect(vector.w).toBe(4.5)
		})
	})
})

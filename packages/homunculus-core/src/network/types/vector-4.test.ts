import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import Vector4 from "./vector-4"

describe("Vector4", () => {
	describe("construction and basic properties", () => {
		test("creates vector with correct x, y, z, w values", () => {
			const vector = new Vector4(1, 2, 3, 4)

			expect(vector.x).toBe(1)
			expect(vector.y).toBe(2)
			expect(vector.z).toBe(3)
			expect(vector.w).toBe(4)
		})

		test("has correct static properties", () => {
			expect(Vector4.size).toBe(16)
			expect(Vector4.zero.x).toBe(0)
			expect(Vector4.zero.y).toBe(0)
			expect(Vector4.zero.z).toBe(0)
			expect(Vector4.zero.w).toBe(0)
		})
	})

	describe("string representation", () => {
		test("formats as <x, y, z, w>", () => {
			const vector = new Vector4(1, 2, 3, 4)

			expect(Vector4.toString(vector)).toBe("<1, 2, 3, 4>")
		})
	})

	describe("buffer serialization", () => {
		test("converts to buffer with correct float values", () => {
			const vector = new Vector4(1.5, 2.5, 3.5, 4.5)
			const buffer = Vector4.toBuffer(vector)

			expect(buffer.length).toBe(Vector4.size)
			expect(buffer.readFloatLE(0)).toBe(1.5)
			expect(buffer.readFloatLE(4)).toBe(2.5)
			expect(buffer.readFloatLE(8)).toBe(3.5)
			expect(buffer.readFloatLE(12)).toBe(4.5)
		})

		test("converts array to buffer with correct float values", () => {
			const array: [number, number, number, number] = [1.5, 2.5, 3.5, 4.5]
			const buffer = Vector4.toBuffer(array)

			expect(buffer.length).toBe(Vector4.size)
			expect(buffer.readFloatLE(0)).toBe(1.5)
			expect(buffer.readFloatLE(4)).toBe(2.5)
			expect(buffer.readFloatLE(8)).toBe(3.5)
			expect(buffer.readFloatLE(12)).toBe(4.5)
		})

		test("creates from buffer with correct values", () => {
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

		test("creates from buffer with offset position", () => {
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

	describe("vector operations", () => {
		test("calculates distance between vectors", () => {
			const v1 = new Vector4(0, 0, 0, 0)
			const v2 = new Vector4(3, 4, 0, 0)

			expect(Vector4.distance(v1, v2)).toBe(5)
		})

		test("normalizes to unit length", () => {
			const vector = new Vector4(3, 4, 0, 0)
			const normalized = vector.normalize()

			const magnitude = Math.sqrt(
				normalized.x ** 2 +
					normalized.y ** 2 +
					normalized.z ** 2 +
					normalized.w ** 2,
			)

			expect(magnitude).toBeCloseTo(1)
		})

		test("calculates dot product", () => {
			const v1 = new Vector4(1, 2, 3, 4)
			const v2 = new Vector4(5, 6, 7, 8)

			expect(Vector4.dot(v1, v2)).toBe(70) // 1*5 + 2*6 + 3*7 + 4*8
		})

		test("calculates magnitude", () => {
			const vector = new Vector4(3, 4, 0, 0)
			expect(vector.magnitude()).toBe(5)
		})

		test("adds vectors", () => {
			const v1 = new Vector4(1, 2, 3, 4)
			const v2 = new Vector4(5, 6, 7, 8)
			const result = Vector4.add(v1, v2)

			expect(result.x).toBe(6)
			expect(result.y).toBe(8)
			expect(result.z).toBe(10)
			expect(result.w).toBe(12)
		})

		test("subtracts vectors", () => {
			const v1 = new Vector4(5, 6, 7, 8)
			const v2 = new Vector4(1, 2, 3, 4)
			const result = Vector4.subtract(v1, v2)

			expect(result.x).toBe(4)
			expect(result.y).toBe(4)
			expect(result.z).toBe(4)
			expect(result.w).toBe(4)
		})

		test("multiplies vector by scalar", () => {
			const vector = new Vector4(1, 2, 3, 4)
			const result = Vector4.multiply(vector, 2)

			expect(result.x).toBe(2)
			expect(result.y).toBe(4)
			expect(result.z).toBe(6)
			expect(result.w).toBe(8)
		})
	})
})

import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import U16 from "./u16"
import Vector3 from "./vector-3"

describe("Vector3", () => {
	describe("construction and basic properties", () => {
		it("creates vector with correct x, y, z values", () => {
			const vector = new Vector3(1, 2, 3)

			expect(vector.x).toBe(1)
			expect(vector.y).toBe(2)
			expect(vector.z).toBe(3)
		})

		it("has correct static properties", () => {
			expect(Vector3.size).toBe(12)
			expect(Vector3.zero.x).toBe(0)
			expect(Vector3.zero.y).toBe(0)
			expect(Vector3.zero.z).toBe(0)
			expect(Vector3.one.x).toBe(1)
			expect(Vector3.one.y).toBe(1)
			expect(Vector3.one.z).toBe(1)
		})
	})

	describe("string representation", () => {
		it("formats as <x, y, z>", () => {
			const vector = new Vector3(1, 2, 3)

			expect(vector.toString()).toBe("<1, 2, 3>")
		})
	})

	describe("buffer serialization", () => {
		it("converts to buffer with correct float values", () => {
			const vector = new Vector3(1.5, 2.5, 3.5)
			const buffer = vector.toBuffer()

			expect(buffer.length).toBe(Vector3.size)
			expect(buffer.readFloatLE(0)).toBe(1.5)
			expect(buffer.readFloatLE(4)).toBe(2.5)
			expect(buffer.readFloatLE(8)).toBe(3.5)
		})

		it("creates from buffer with correct values", () => {
			const buffer = Buffer.alloc(12)

			buffer.writeFloatLE(1.5, 0)
			buffer.writeFloatLE(2.5, 4)
			buffer.writeFloatLE(3.5, 8)

			const vector = Vector3.fromBuffer(buffer)

			expect(vector.x).toBe(1.5)
			expect(vector.y).toBe(2.5)
			expect(vector.z).toBe(3.5)
		})

		it("creates from buffer with U16 type", () => {
			const buffer = Buffer.allocUnsafe(6)

			buffer.writeUInt16LE(32767, 0) // 0.5 in U16
			buffer.writeUInt16LE(65535, 2) // 1.0 in U16
			buffer.writeUInt16LE(0, 4) // 0.0 in U16

			const vector = Vector3.fromBuffer(buffer, 0, U16)

			expect(vector.x).toBeCloseTo(0.5)
			expect(vector.y).toBeCloseTo(1.0)
			expect(vector.z).toBeCloseTo(0.0)
		})

		it("creates from buffer with U16 type and custom bounds", () => {
			const buffer = Buffer.alloc(6)

			buffer.writeUInt16LE(32767, 0) // 0.5 in U16
			buffer.writeUInt16LE(65535, 2) // 1.0 in U16
			buffer.writeUInt16LE(0, 4) // 0.0 in U16

			const vector = Vector3.fromBuffer(buffer, 0, U16, -1, 1)

			expect(vector.x).toBeCloseTo(0)
			expect(vector.y).toBeCloseTo(1)
			expect(vector.z).toBeCloseTo(-1)
		})

		it("handles array input", () => {
			const buffer = Vector3.toBuffer([1.5, 2.5, 3.5])

			expect(buffer.length).toBe(12)
			expect(buffer.readFloatLE(0)).toBe(1.5)
			expect(buffer.readFloatLE(4)).toBe(2.5)
			expect(buffer.readFloatLE(8)).toBe(3.5)
		})

		it("handles missing array values", () => {
			const buffer = Vector3.toBuffer([1.5, 0, 0])
			expect(buffer.length).toBe(12)
			expect(buffer.readFloatLE(0)).toBe(1.5)
			expect(buffer.readFloatLE(4)).toBe(0)
			expect(buffer.readFloatLE(8)).toBe(0)
		})
	})

	describe("vector operations", () => {
		it("calculates distance between vectors", () => {
			const v1 = new Vector3(0, 0, 0)
			const v2 = new Vector3(3, 4, 0)

			expect(v1.distance(v2)).toBeCloseTo(5)
			expect(Vector3.distance(v1, v2)).toBeCloseTo(5)
		})

		it("normalizes to unit length", () => {
			const vector = new Vector3(3, 4, 0)
			const normalized = vector.normalize()

			const magnitude = Math.sqrt(
				normalized.x ** 2 + normalized.y ** 2 + normalized.z ** 2,
			)

			expect(magnitude).toBeCloseTo(1)
			expect(normalized.x).toBeCloseTo(0.6)
			expect(normalized.y).toBeCloseTo(0.8)
			expect(normalized.z).toBeCloseTo(0)
		})

		it("calculates dot product", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = new Vector3(4, 5, 6)

			expect(v1.dot(v2)).toBe(32)
			expect(Vector3.dot(v1, v2)).toBe(32)
		})

		it("calculates cross product", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = new Vector3(4, 5, 6)

			const cross = v1.cross(v2)

			expect(cross.x).toBe(-3)
			expect(cross.y).toBe(6)
			expect(cross.z).toBe(-3)
		})

		it("handles zero vector normalization", () => {
			const vector = new Vector3(0, 0, 0)
			const normalized = vector.normalize()

			expect(normalized.x).toBe(Number.NaN)
			expect(normalized.y).toBe(Number.NaN)
			expect(normalized.z).toBe(Number.NaN)
		})
	})
})

import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import U16 from "./u16"
import Vector3 from "./vector-3"

describe("Vector3", () => {
	describe("construction and basic properties", () => {
		test("creates vector with correct x, y, z values", () => {
			const vector = new Vector3(1, 2, 3)

			expect(vector.x).toBe(1)
			expect(vector.y).toBe(2)
			expect(vector.z).toBe(3)
		})

		test("has correct static properties", () => {
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
		test("formats as <x, y, z>", () => {
			const vector = new Vector3(1, 2, 3)

			expect(vector.toString()).toBe("<1, 2, 3>")
		})
	})

	describe("buffer serialization", () => {
		test("converts to buffer with correct float values", () => {
			const vector = new Vector3(1.5, 2.5, 3.5)
			const buffer = vector.toBuffer()

			expect(buffer.length).toBe(Vector3.size)
			expect(buffer.readFloatLE(0)).toBe(1.5)
			expect(buffer.readFloatLE(4)).toBe(2.5)
			expect(buffer.readFloatLE(8)).toBe(3.5)
		})

		test("creates from buffer with correct values", () => {
			const buffer = Buffer.allocUnsafe(Vector3.size)

			buffer.writeFloatLE(1.5, 0)
			buffer.writeFloatLE(2.5, 4)
			buffer.writeFloatLE(3.5, 8)

			const vector = Vector3.fromBuffer(buffer)

			expect(vector.x).toBe(1.5)
			expect(vector.y).toBe(2.5)
			expect(vector.z).toBe(3.5)
		})

		test("creates from buffer with U16 type", () => {
			const buffer = Buffer.allocUnsafe(U16.size * 3)

			buffer.writeUInt16LE(32768, 0) // 0.5 in normalized U16
			buffer.writeUInt16LE(49152, 2) // 0.75 in normalized U16
			buffer.writeUInt16LE(16384, 4) // 0.25 in normalized U16

			const vector = Vector3.fromBuffer(buffer, 0, U16, 0, 1)

			expect(vector.x).toBeCloseTo(0.5)
			expect(vector.y).toBeCloseTo(0.75)
			expect(vector.z).toBeCloseTo(0.25)
		})

		test("creates from buffer with U16 type and custom bounds", () => {
			const buffer = Buffer.allocUnsafe(U16.size * 3)

			buffer.writeUInt16LE(32768, 0) // 0.5 in normalized U16
			buffer.writeUInt16LE(49152, 2) // 0.75 in normalized U16
			buffer.writeUInt16LE(16384, 4) // 0.25 in normalized U16

			const vector = Vector3.fromBuffer(buffer, 0, U16, -1, 1)

			expect(vector.x).toBeCloseTo(0) // 0.5 normalized to [-1,1] range
			expect(vector.y).toBeCloseTo(0.5) // 0.75 normalized to [-1,1] range
			expect(vector.z).toBeCloseTo(-0.5) // 0.25 normalized to [-1,1] range
		})
	})

	describe("vector operations", () => {
		test("calculates distance between vectors", () => {
			const v1 = new Vector3(0, 0, 0)
			const v2 = new Vector3(3, 4, 0)

			expect(Vector3.distance(v1, v2)).toBe(5)
		})

		test("normalizes to unit length", () => {
			const vector = new Vector3(3, 4, 0)
			const normalized = vector.normalize()

			const magnitude = Math.sqrt(
				normalized.x ** 2 + normalized.y ** 2 + normalized.z ** 2,
			)

			expect(magnitude).toBeCloseTo(1)
		})

		test("calculates dot product", () => {
			const v1 = new Vector3(1, 2, 3)
			const v2 = new Vector3(4, 5, 6)

			expect(Vector3.dot(v1, v2)).toBe(32) // 1 * 4 + 2 * 5 + 3 * 6
		})

		test("calculates cross product", () => {
			const v1 = new Vector3(1, 0, 0)
			const v2 = new Vector3(0, 1, 0)
			const cross = Vector3.cross(v1, v2)

			expect(cross.x).toBe(0)
			expect(cross.y).toBe(0)
			expect(cross.z).toBe(1)
		})
	})
})

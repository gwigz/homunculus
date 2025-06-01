import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import Vector3D from "./vector-3-d"

describe("Vector3D", () => {
	describe("construction and basic properties", () => {
		test("creates vector with correct x, y, z values", () => {
			const vector = new Vector3D(1, 2, 3)

			expect(vector.x).toBe(1)
			expect(vector.y).toBe(2)
			expect(vector.z).toBe(3)
		})

		test("has correct static properties", () => {
			expect(Vector3D.size).toBe(24)
			expect(Vector3D.zero.x).toBe(0)
			expect(Vector3D.zero.y).toBe(0)
			expect(Vector3D.zero.z).toBe(0)
			expect(Vector3D.one.x).toBe(1)
			expect(Vector3D.one.y).toBe(1)
			expect(Vector3D.one.z).toBe(1)
		})
	})

	describe("string representation", () => {
		test("formats as <x, y, z>", () => {
			const vector = new Vector3D(1, 2, 3)

			expect(vector.toString()).toBe("<1, 2, 3>")
		})
	})

	describe("buffer serialization", () => {
		test("converts to buffer with correct double values", () => {
			const vector = new Vector3D(1.5, 2.5, 3.5)
			const buffer = vector.toBuffer()

			expect(buffer.length).toBe(Vector3D.size)
			expect(buffer.readDoubleLE(0)).toBe(1.5)
			expect(buffer.readDoubleLE(8)).toBe(2.5)
			expect(buffer.readDoubleLE(16)).toBe(3.5)
		})

		test("creates from buffer with correct values", () => {
			const buffer = Buffer.allocUnsafe(Vector3D.size)

			buffer.writeDoubleLE(1.5, 0)
			buffer.writeDoubleLE(2.5, 8)
			buffer.writeDoubleLE(3.5, 16)

			const vector = Vector3D.fromBuffer(buffer)

			expect(vector.x).toBe(1.5)
			expect(vector.y).toBe(2.5)
			expect(vector.z).toBe(3.5)
		})
	})

	describe("vector operations", () => {
		test("calculates distance between vectors", () => {
			const v1 = new Vector3D(0, 0, 0)
			const v2 = new Vector3D(3, 4, 0)

			expect(Vector3D.distance(v1, v2)).toBe(5)
		})

		test("normalizes to unit length", () => {
			const vector = new Vector3D(3, 4, 0)
			const normalized = vector.normalize()

			const magnitude = Math.sqrt(
				normalized.x ** 2 + normalized.y ** 2 + normalized.z ** 2,
			)

			expect(magnitude).toBeCloseTo(1)
		})

		test("calculates dot product", () => {
			const v1 = new Vector3D(1, 2, 3)
			const v2 = new Vector3D(4, 5, 6)

			expect(Vector3D.dot(v1, v2)).toBe(32) // 1 * 4 + 2 * 5 + 3 * 6
		})

		test("calculates cross product", () => {
			const v1 = new Vector3D(1, 0, 0)
			const v2 = new Vector3D(0, 1, 0)
			const cross = Vector3D.cross(v1, v2)

			expect(cross.x).toBe(0)
			expect(cross.y).toBe(0)
			expect(cross.z).toBe(1)
		})
	})
})

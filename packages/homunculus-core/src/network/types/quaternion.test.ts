import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import Quaternion from "./quaternion"
import U16 from "./u16"
import Vector3 from "./vector-3"

type Euler = [x: number, y: number, z: number]

describe("Quaternion", () => {
	describe("construction and basic properties", () => {
		test("creates quaternion with correct x, y, z, w values", () => {
			const quaternion = new Quaternion(1, 2, 3, 4)

			expect(quaternion.x).toBe(1)
			expect(quaternion.y).toBe(2)
			expect(quaternion.z).toBe(3)
			expect(quaternion.w).toBe(4)
		})

		test("has correct static properties", () => {
			expect(Quaternion.size).toBe(12)
			expect(Quaternion.zero.x).toBe(0)
			expect(Quaternion.zero.y).toBe(0)
			expect(Quaternion.zero.z).toBe(0)
			expect(Quaternion.zero.w).toBe(0)
			expect(Quaternion.identity.x).toBe(0)
			expect(Quaternion.identity.y).toBe(0)
			expect(Quaternion.identity.z).toBe(0)
			expect(Quaternion.identity.w).toBe(1)
		})
	})

	describe("string representation", () => {
		test("formats as <x, y, z, w>", () => {
			const quaternion = new Quaternion(1, 2, 3, 4)

			expect(Quaternion.toString(quaternion)).toBe("<1, 2, 3, 4>")
		})
	})

	describe("buffer serialization", () => {
		test("converts to buffer with correct float values", () => {
			const quaternion = new Quaternion(1.5, 2.5, 3.5, 4.5)
			const buffer = Quaternion.toBuffer(quaternion)

			expect(buffer.length).toBe(Quaternion.size)
			expect(buffer.readFloatLE(0)).toBe(1.5)
			expect(buffer.readFloatLE(4)).toBe(2.5)
			expect(buffer.readFloatLE(8)).toBe(3.5)
		})

		test("creates from buffer with correct values", () => {
			const buffer = Buffer.allocUnsafe(Quaternion.size)

			buffer.writeFloatLE(1.5, 0)
			buffer.writeFloatLE(2.5, 4)
			buffer.writeFloatLE(3.5, 8)

			const quaternion = Quaternion.fromBuffer(buffer)

			expect(quaternion.x).toBe(1.5)
			expect(quaternion.y).toBe(2.5)
			expect(quaternion.z).toBe(3.5)
			expect(quaternion.w).toBeCloseTo(0) // w is 0 when sum of squares > 1
		})

		test("creates from buffer with U16 type", () => {
			const buffer = Buffer.allocUnsafe(U16.size * 3)

			buffer.writeUInt16LE(32768, 0) // 0.5 in normalized U16
			buffer.writeUInt16LE(49152, 2) // 0.75 in normalized U16
			buffer.writeUInt16LE(16384, 4) // 0.25 in normalized U16

			const quaternion = Quaternion.fromBuffer(buffer, 0, true, U16, -1, 1)

			expect(quaternion.x).toBeCloseTo(0) // 0.5 normalized to [-1,1] range
			expect(quaternion.y).toBeCloseTo(0.5) // 0.75 normalized to [-1,1] range
			expect(quaternion.z).toBeCloseTo(-0.5) // 0.25 normalized to [-1,1] range
			expect(quaternion.w).toBeCloseTo(Math.SQRT2 / 2)
		})

		test("handles negative w component in toBuffer", () => {
			const quaternion = new Quaternion(1.5, 2.5, 3.5, -4.5)
			const buffer = Quaternion.toBuffer(quaternion)

			expect(buffer.length).toBe(Quaternion.size)
			expect(buffer.readFloatLE(0)).toBe(-1.5) // negated x
			expect(buffer.readFloatLE(4)).toBe(-2.5) // negated y
			expect(buffer.readFloatLE(8)).toBe(-3.5) // negated z
		})
	})

	describe("euler angle conversion", () => {
		test("creates quaternion from euler angles array", () => {
			// 90 degrees around X axis
			const euler: Euler = [Math.PI / 2, 0, 0]

			const quaternion = Quaternion.fromEuler(euler)

			expect(quaternion.x).toBeCloseTo(Math.SQRT2 / 2) // sin(45 degrees)
			expect(quaternion.y).toBe(0)
			expect(quaternion.z).toBe(0)
			expect(quaternion.w).toBeCloseTo(Math.SQRT2 / 2) // cos(45 degrees)
		})

		test("creates quaternion from Vector3 euler angles", () => {
			// 90 degrees around X axis
			const euler = new Vector3(Math.PI / 2, 0, 0)

			const quaternion = Quaternion.fromEuler(euler)

			expect(quaternion.x).toBeCloseTo(Math.SQRT2 / 2) // sin(45 degrees)
			expect(quaternion.y).toBe(0)
			expect(quaternion.z).toBe(0)
			expect(quaternion.w).toBeCloseTo(Math.SQRT2 / 2) // cos(45 degrees)
		})

		test("converts quaternion to euler angles", () => {
			// create a quaternion representing 90 degrees around X axis
			const quaternion = new Quaternion(Math.SQRT2 / 2, 0, 0, Math.SQRT2 / 2)
			const euler = Quaternion.toEuler(quaternion)

			expect(euler.x).toBeCloseTo(Math.PI / 2) // 90 degrees
			expect(euler.y).toBe(0)
			expect(euler.z).toBe(0)
		})

		test("handles multiple rotations", () => {
			// create a quaternion representing 90 degrees around X and Y axes
			const euler: Euler = [Math.PI / 2, Math.PI / 2, 0]

			const quaternion = Quaternion.fromEuler(euler)
			const result = Quaternion.toEuler(quaternion)

			expect(result.x).toBe(Math.PI / 2)
			expect(result.y).toBe(Math.PI / 2)
			expect(result.z).toBe(0)
		})
	})
})

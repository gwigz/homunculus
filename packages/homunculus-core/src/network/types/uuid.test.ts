import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import UUID from "./uuid"

describe("UUID", () => {
	describe("size and constants", () => {
		it("has correct size", () => {
			expect(UUID.size).toBe(16)
		})

		it("has correct zero UUID", () => {
			expect(UUID.zero).toBe("00000000-0000-0000-0000-000000000000")
		})
	})

	describe("buffer serialization", () => {
		it("converts string UUID to buffer", () => {
			const uuid = "a2e76fcd-9360-4f6d-a924-000000000003"
			const buffer = UUID.toBuffer(uuid)

			expect(buffer.length).toBe(UUID.size)
			expect(UUID.fromBuffer(buffer)).toBe(uuid)
		})

		it("converts zero UUID to buffer", () => {
			const buffer = UUID.toBuffer(UUID.zero)

			expect(buffer.length).toBe(UUID.size)
			expect(UUID.fromBuffer(buffer)).toBe(UUID.zero)
		})

		it("returns buffer if buffer is passed", () => {
			const input = Buffer.alloc(UUID.size)
			const output = UUID.toBuffer(input)

			expect(output).toBe(input)
		})
	})

	describe("buffer deserialization", () => {
		it("creates UUID from buffer", () => {
			const uuid = "a2e76fcd-9360-4f6d-a924-000000000003"
			const buffer = UUID.toBuffer(uuid)

			expect(UUID.fromBuffer(buffer)).toBe(uuid)
		})

		it("creates UUID from buffer at offset", () => {
			const uuid = "a2e76fcd-9360-4f6d-a924-000000000003"
			const buffer = Buffer.allocUnsafe(UUID.size + 4)

			UUID.toBuffer(uuid).copy(buffer, 4)

			expect(UUID.fromBuffer(buffer, 4)).toBe(uuid)
		})

		it("creates zero UUID from zero buffer", () => {
			const buffer = Buffer.alloc(UUID.size)

			expect(UUID.fromBuffer(buffer)).toBe(UUID.zero)
		})
	})

	describe("random generation", () => {
		it("generates valid UUID", () => {
			const uuid = UUID.random()

			expect(uuid).toMatch(
				/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
			)
		})

		it("generates different UUIDs", () => {
			const uuid1 = UUID.random()
			const uuid2 = UUID.random()

			expect(uuid1).not.toBe(uuid2)
		})
	})

	describe("validation", () => {
		it("validates correct UUID format", () => {
			expect(UUID.validate("a2e76fcd-9360-4f6d-a924-000000000003")).toBe(true)
			expect(UUID.validate(UUID.zero)).toBe(true)
			expect(UUID.validate(UUID.random())).toBe(true)
		})

		it("rejects invalid UUID formats", () => {
			expect(UUID.validate("not-a-uuid")).toBe(false)
			expect(UUID.validate("a2e76fcd-9360-4f6d-a924-00000000000")).toBe(false) // too short
			expect(UUID.validate("a2e76fcd-9360-4f6d-a924-0000000000000")).toBe(false) // too long
			expect(UUID.validate("a2e76fcd93604f6da924000000000003")).toBe(false) // missing hyphens
			expect(UUID.validate("a2e76fcd-9360-4f6d-a924-00000000000g")).toBe(false) // invalid character
		})
	})
})

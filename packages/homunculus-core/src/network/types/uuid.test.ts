import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import UUID from "./uuid"

describe("UUID", () => {
	describe("size and constants", () => {
		test("has correct size", () => {
			expect(UUID.size).toBe(16)
		})

		test("has correct zero UUID", () => {
			expect(UUID.zero).toBe("00000000-0000-0000-0000-000000000000")
		})
	})

	describe("buffer serialization", () => {
		test("converts string UUID to buffer", () => {
			const uuid = "a2e76fcd-9360-4f6d-a924-000000000003"
			const buffer = UUID.toBuffer(uuid)

			expect(buffer.length).toBe(UUID.size)
			expect(UUID.fromBuffer(buffer)).toBe(uuid)
		})

		test("converts zero UUID to buffer", () => {
			const buffer = UUID.toBuffer(UUID.zero)

			expect(buffer.length).toBe(UUID.size)
			expect(UUID.fromBuffer(buffer)).toBe(UUID.zero)
		})

		test("returns buffer if buffer is passed", () => {
			const input = Buffer.alloc(UUID.size)
			const output = UUID.toBuffer(input)

			expect(output).toBe(input)
		})
	})

	describe("buffer deserialization", () => {
		test("creates UUID from buffer", () => {
			const uuid = "a2e76fcd-9360-4f6d-a924-000000000003"
			const buffer = UUID.toBuffer(uuid)

			expect(UUID.fromBuffer(buffer)).toBe(uuid)
		})

		test("creates UUID from buffer at offset", () => {
			const uuid = "a2e76fcd-9360-4f6d-a924-000000000003"
			const buffer = Buffer.allocUnsafe(UUID.size + 4)

			UUID.toBuffer(uuid).copy(buffer, 4)

			expect(UUID.fromBuffer(buffer, 4)).toBe(uuid)
		})

		test("creates zero UUID from zero buffer", () => {
			const buffer = Buffer.alloc(UUID.size)

			expect(UUID.fromBuffer(buffer)).toBe(UUID.zero)
		})
	})

	describe("padding", () => {
		test("pads single digit hex values", () => {
			expect(UUID.pad("a", 2)).toBe("0a")
		})

		test("pads multiple digit hex values", () => {
			expect(UUID.pad("abc", 4)).toBe("0abc")
		})

		test("does not pad when width matches", () => {
			expect(UUID.pad("ab", 2)).toBe("ab")
		})

		test("handles decimal values", () => {
			expect(UUID.pad("1.2", 4)).toBe("001.2")
		})
	})

	describe("random generation", () => {
		test("generates valid UUID", () => {
			const uuid = UUID.random()

			expect(uuid).toMatch(
				/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
			)
		})

		test("generates different UUIDs", () => {
			const uuid1 = UUID.random()
			const uuid2 = UUID.random()

			expect(uuid1).not.toBe(uuid2)
		})
	})
})

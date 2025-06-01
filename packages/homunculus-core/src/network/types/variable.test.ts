import { Buffer } from "node:buffer"
import { describe, expect, test } from "bun:test"
import Variable from "./variable"

describe("Variable", () => {
	describe("buffer serialization", () => {
		describe("with size 1", () => {
			test("converts string to prefixed buffer", () => {
				const value = "Hello, World!"
				const result = Variable.toPrefixedBuffer(1, value)

				expect(result.length).toBe(1 + value.length)
				expect(result.readUInt8(0)).toBe(value.length)
				expect(result.toString("utf-8", 1)).toBe(value)
			})

			test("converts buffer to prefixed buffer", () => {
				const value = Buffer.from("Hello, World!", "utf-8")
				const result = Variable.toPrefixedBuffer(1, value)

				expect(result.length).toBe(1 + value.length)
				expect(result.readUInt8(0)).toBe(value.length)
				expect(result.subarray(1)).toEqual(value)
			})

			test("truncates string if too long", () => {
				const value = "a".repeat(300)
				const result = Variable.toPrefixedBuffer(1, value)

				expect(result.length).toBe(1 + 255)
				expect(result.readUInt8(0)).toBe(255)
				expect(result.toString("utf-8", 1)).toBe("a".repeat(255))
			})

			test("handles empty string", () => {
				const value = ""
				const result = Variable.toPrefixedBuffer(1, value)

				expect(result.length).toBe(1)
				expect(result.readUInt8(0)).toBe(0)
			})
		})

		describe("with size 2", () => {
			test("converts string to prefixed buffer", () => {
				const value = "Hello, World!"
				const result = Variable.toPrefixedBuffer(2, value)

				expect(result.length).toBe(2 + value.length)
				expect(result.readUInt16LE(0)).toBe(value.length)
				expect(result.toString("utf-8", 2)).toBe(value)
			})

			test("converts buffer to prefixed buffer", () => {
				const value = Buffer.from("Hello, World!", "utf-8")
				const result = Variable.toPrefixedBuffer(2, value)

				expect(result.length).toBe(2 + value.length)
				expect(result.readUInt16LE(0)).toBe(value.length)
				expect(result.subarray(2)).toEqual(value)
			})

			test("truncates string if too long", () => {
				const value = "a".repeat(70000)
				const result = Variable.toPrefixedBuffer(2, value)

				expect(result.length).toBe(2 + 65535)
				expect(result.readUInt16LE(0)).toBe(65535)
				expect(result.toString("utf-8", 2)).toBe("a".repeat(65535))
			})

			test("handles empty string", () => {
				const value = ""
				const result = Variable.toPrefixedBuffer(2, value)

				expect(result.length).toBe(2)
				expect(result.readUInt16LE(0)).toBe(0)
			})
		})
	})

	describe("buffer deserialization", () => {
		describe("with size 1", () => {
			test("extracts string from prefixed buffer", () => {
				const value = "Hello, World!"
				const buffer = Variable.toPrefixedBuffer(1, value)
				const result = Variable.fromPrefixedBuffer(1, buffer, 0)

				expect(result.toString("utf-8")).toBe(value)
			})

			test("extracts string from prefixed buffer at offset", () => {
				const value = "Hello, World!"
				const buffer = Variable.toPrefixedBuffer(1, value)
				const fullBuffer = Buffer.concat([Buffer.alloc(2), buffer])
				const result = Variable.fromPrefixedBuffer(1, fullBuffer, 2)

				expect(result.toString("utf-8")).toBe(value)
			})

			test("handles empty string", () => {
				const value = ""
				const buffer = Variable.toPrefixedBuffer(1, value)
				const result = Variable.fromPrefixedBuffer(1, buffer, 0)

				expect(result.length).toBe(0)
			})
		})

		describe("with size 2", () => {
			test("extracts string from prefixed buffer", () => {
				const value = "Hello, World!"
				const buffer = Variable.toPrefixedBuffer(2, value)
				const result = Variable.fromPrefixedBuffer(2, buffer, 0)

				expect(result.toString("utf-8")).toBe(value)
			})

			test("extracts string from prefixed buffer at offset", () => {
				const value = "Hello, World!"
				const buffer = Variable.toPrefixedBuffer(2, value)
				const fullBuffer = Buffer.concat([Buffer.alloc(2), buffer])
				const result = Variable.fromPrefixedBuffer(2, fullBuffer, 2)

				expect(result.toString("utf-8")).toBe(value)
			})

			test("handles empty string", () => {
				const value = ""
				const buffer = Variable.toPrefixedBuffer(2, value)
				const result = Variable.fromPrefixedBuffer(2, buffer, 0)

				expect(result.length).toBe(0)
			})
		})
	})
})

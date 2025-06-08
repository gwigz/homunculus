import { describe, expect, it } from "bun:test"
import { UUID } from "../types"
// @ts-expect-error no types
import xml from "./__test__/llsd.xml" with { type: "text" }
import { LLSD } from "./llsd"

describe("LLSD", () => {
	it("handles comprehensive test", () => {
		const parsed = LLSD.parseXml(xml)

		expect(parsed).toBeDefined()
		expect(typeof parsed).toBe("object")
		expect(parsed).not.toBeNull()

		const data = parsed as any

		expect(data.undef_value).toBeNull()
		expect(data.boolean_true).toBe(true)
		expect(data.boolean_false).toBe(false)
		expect(data.integer_positive).toBe(42)
		expect(data.real_positive).toBeCloseTo(3.14)
		expect(data.string_hello).toBe("Hello, World!")
		expect(typeof data.uuid_valid).toBe("string")
		expect(UUID.validate(data.uuid_valid)).toBe(true)
		expect(data.date_valid).toBeInstanceOf(Date)
		expect(data.binary_hello).toBeInstanceOf(Buffer)
		expect(Array.isArray(data.array_mixed)).toBe(true)
		expect(typeof data.map_simple).toBe("object")

		expect(Number.isNaN(data.real_nan)).toBe(true)
		expect(data.real_infinity).toBe(Number.POSITIVE_INFINITY)
		expect(data.real_negative_infinity).toBe(Number.NEGATIVE_INFINITY)
		expect(Object.is(data.real_negative_zero, -0)).toBe(true)
		expect(1 / data.real_negative_zero).toBe(Number.NEGATIVE_INFINITY)

		const reserialized = LLSD.formatXml(parsed)

		expect(reserialized).toBeDefined()
		expect(typeof reserialized).toBe("string")
		expect(reserialized).toContain("<?xml")
		expect(reserialized).toContain("<llsd>")

		expect(reserialized).toEqual(
			xml
				.replaceAll("\n", "")
				.replace(/\s\s+/g, "")
				.replace(/<!--.*?-->/g, "")
				.replace(
					// need to convert uuid to string, since we're expecting UUID class
					// to be used, if the intention is to have UUID type
					/<uuid>([0-9a-f-]+)<\/uuid>/g,
					"<string>$1</string>",
				),
		)

		const reparsed = LLSD.parseXml(reserialized) as any

		expect(reparsed).toEqual(parsed as any)
		expect(Number.isNaN(reparsed.real_nan)).toBe(true)
		expect(Object.is(reparsed.real_negative_zero, -0)).toBe(true)
	})

	it("handles error cases", () => {
		expect(() =>
			LLSD.parseXml(
				'<?xml version="1.0" ?><notllsd><integer>42</integer></notllsd>',
			),
		).toThrow("Expected <llsd> as root element")

		expect(() =>
			LLSD.parseXml(
				'<?xml version="1.0" ?><llsd><integer>42</integer><string>test</string></llsd>',
			),
		).toThrow("Expected one data child of root element")

		expect(() =>
			LLSD.parseXml(
				'<?xml version="1.0" ?><llsd><binary encoding="base32">test</binary></llsd>',
			),
		).toThrow("Unexpected encoding on <binary>: base32")

		expect(() =>
			LLSD.parseXml(
				'<?xml version="1.0" ?><llsd><unknown>value</unknown></llsd>',
			),
		).toThrow("Unexpected element: unknown")
	})
})

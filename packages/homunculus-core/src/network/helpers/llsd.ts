// TODO: replace this XML parser with something more lightweight
import { DOMParser, type Element, type Node, type Text } from "@xmldom/xmldom"
import { match, P } from "ts-pattern"
import { type UUIDString, UUID as UUIDType } from "~/network/types/uuid"

class UUID {
	private uuid: UUIDString

	constructor(value?: string | number[]) {
		if (typeof value === "undefined") {
			this.uuid = UUIDType.zero
		} else if (typeof value === "string") {
			if (UUIDType.validate(value)) {
				this.uuid = value.toLowerCase() as UUIDString
			} else {
				throw new TypeError(`Invalid UUID string: ${value}`)
			}
		} else if (Array.isArray(value)) {
			if (value.length !== 16) {
				throw new Error("Invalid UUID array length")
			}

			this.uuid = UUIDType.fromBuffer(Buffer.from(value))
		} else {
			throw new TypeError("Expected string or array")
		}
	}

	public toString() {
		return this.uuid
	}

	public toJSON() {
		return this.uuid
	}
}

export class LLSD {
	public static UUID = UUID

	public static parseXml(xml: string) {
		try {
			const xmldoc = new DOMParser().parseFromString(xml, "text/xml")

			if (xmldoc.documentElement?.nodeName !== "llsd") {
				throw new Error("Expected <llsd> as root element")
			}

			// find the first non-comment, non-text child node
			let node: Node | null = null
			let count = 0

			for (let i = 0; i < xmldoc.documentElement.childNodes.length; i++) {
				const child = xmldoc.documentElement.childNodes[i]!

				// skip comment and whitespace text nodes
				if (
					child.nodeType === 8 ||
					(child.nodeType === 3 && child.nodeValue?.trim() === "")
				) {
					continue
				}

				count++

				if (!node) {
					node = child
				}
			}

			if (count !== 1) {
				throw new Error("Expected one data child of root element")
			}

			if (!node) {
				throw new Error("No data element found in root")
			}

			return LLSD.processElement(node)
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`LLSD XML parsing failed: ${error.message}`)
			}
			throw error
		}
	}

	public static formatXml(data: unknown) {
		const xml: string[] = []

		function xmlEscape(string: string) {
			return string
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
		}

		function writeElement(
			tagName: string,
			content: string,
			selfClosing = false,
		) {
			if (selfClosing) {
				xml.push(`<${tagName}/>`)
			} else {
				xml.push(`<${tagName}>`, content, `</${tagName}>`)
			}
		}

		function writeValue(datum: unknown) {
			const type = LLSD.type(datum)

			match(type)
				.with("undefined", () => {
					writeElement("undef", "", true)
				})
				.with("binary", () => {
					xml.push(
						`<binary encoding="base64">`,
						LLSD.asString(datum),
						"</binary>",
					)
				})
				.with(
					P.union("boolean", "integer", "real", "uuid", "date", "uri"),
					(type) => {
						writeElement(type, LLSD.asString(datum))
					},
				)
				.with("string", () => {
					writeElement("string", xmlEscape(datum as string))
				})
				.with("array", () => {
					xml.push("<array>")

					const array = datum as unknown[]

					for (const item of array) {
						writeValue(item)
					}

					xml.push("</array>")
				})
				.with("map", () => {
					xml.push("<map>")

					const map = datum as Record<string, unknown>
					const keys = Object.keys(map)

					for (const key of keys) {
						xml.push("<key>", xmlEscape(key), "</key>")
						writeValue(map[key])
					}

					xml.push("</map>")
				})
				.run()
		}

		xml.push('<?xml version="1.0" encoding="UTF-8"?><llsd>')
		writeValue(data)
		xml.push("</llsd>")

		return xml.join("")
	}

	private static getNodeText(node: Node) {
		if (!node.hasChildNodes()) {
			return ""
		}

		if (node.childNodes.length > 1) {
			throw new Error(`Expected single child of: ${node.nodeName}`)
		}

		const child = node.firstChild!

		if (child.nodeType !== 3) {
			throw new Error(`Expected text node child of: ${node.nodeName}`)
		}

		return (child as Text).data
	}

	private static processElement(node: Node) {
		return match(node.nodeName)
			.with("undef", () => null)
			.with("boolean", () => LLSD.asBoolean(LLSD.getNodeText(node)))
			.with("integer", () => LLSD.asInteger(LLSD.getNodeText(node)))
			.with("real", () => LLSD.asReal(LLSD.getNodeText(node)))
			.with("uuid", () => LLSD.asUUID(LLSD.getNodeText(node)).toString())
			.with("string", () => LLSD.getNodeText(node))
			.with("uri", () => {
				try {
					return new URL(LLSD.getNodeText(node))
				} catch {}
			})
			.with("date", () => LLSD.asDate(LLSD.getNodeText(node)))
			.with("binary", () => {
				const encoding = (node as Element).getAttribute("encoding")

				if (encoding && encoding !== "base64") {
					throw new Error(`Unexpected encoding on <binary>: ${encoding}`)
				}

				return LLSD.asBinary(LLSD.getNodeText(node))
			})
			.with("map", () => {
				const map: Record<string, unknown> = {}

				for (let child = node.firstChild; child; child = child.nextSibling) {
					// skip comment and whitespace text nodes
					if (
						child.nodeType === 8 ||
						(child.nodeType === 3 && child.nodeValue?.trim() === "")
					) {
						continue
					}

					if (child.nodeName !== "key") {
						throw new Error("Expected <key> as child of <map>")
					}

					const key = LLSD.getNodeText(child)

					// find next non-comment, non-whitespace sibling
					do {
						child = child.nextSibling
					} while (
						child &&
						(child.nodeType === 8 ||
							(child.nodeType === 3 && child.nodeValue?.trim() === ""))
					)

					if (!child) {
						throw new Error("Missing sibling of <key> in <map>")
					}

					map[key] = LLSD.processElement(child)
				}

				return map
			})
			.with("array", () => {
				const array: unknown[] = []

				for (let child = node.firstChild; child; child = child.nextSibling) {
					// skip comment and whitespace text nodes
					if (
						child.nodeType === 8 ||
						(child.nodeType === 3 && child.nodeValue?.trim() === "")
					) {
						continue
					}

					array.push(LLSD.processElement(child))
				}

				return array
			})
			.otherwise((nodeName) => {
				throw new Error(`Unexpected element: ${nodeName}`)
			})
	}

	private static parseISODate(str: string) {
		const matches =
			/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(str)

		if (matches) {
			return new Date(
				Date.UTC(
					+matches[1]!,
					+matches[2]! - 1,
					+matches[3]!,
					+matches[4]!,
					+matches[5]!,
					+matches[6]!,
				),
			)
		}

		throw new Error(`Invalid date string format: ${str}`)
	}

	private static isNegativeZero(a: number) {
		return a === 0 && 1 / a === Number.NEGATIVE_INFINITY
	}

	private static isInt32(a: number) {
		return a >> 0 === a
	}

	private static parseFloat(string: string) {
		return match(string)
			.with("-Infinity", () => Number.NEGATIVE_INFINITY)
			.with("-Zero", () => -0.0)
			.with("0.0", () => 0.0)
			.with("+Zero", () => 0.0)
			.with("Infinity", () => Number.POSITIVE_INFINITY)
			.with("+Infinity", () => Number.POSITIVE_INFINITY)
			.with(P.union("NaNS", "NaNQ"), () => Number.NaN)
			.with(P.string.regex(/^[-+]?([0-9]*\.?[0-9]+)([eE][-+]?[0-9]+)?$/), () =>
				Number.parseFloat(string),
			)
			.otherwise(() => null)
	}

	private static formatFloat(float: number) {
		return match(float)
			.with(Number.NaN, () => "NaNS")
			.with(Number.POSITIVE_INFINITY, () => "Infinity")
			.with(Number.NEGATIVE_INFINITY, () => "-Infinity")
			.with(P.when(LLSD.isNegativeZero), () => "-Zero")
			.with(
				P.when((n: number) => n === 0 && !LLSD.isNegativeZero(n)),
				() => "+Zero",
			)
			.otherwise(() => String(float))
	}

	private static type(value: unknown) {
		return match(value)
			.with(P.boolean, () => "boolean")
			.with(
				P.when(
					(n): n is number =>
						typeof n === "number" && LLSD.isInt32(n) && !LLSD.isNegativeZero(n),
				),
				() => "integer",
			)
			.with(P.number, () => "real")
			.with(P.string, () => "string")
			.with(P.nullish, () => "undefined")
			.with(P.instanceOf(UUID), () => "uuid")
			.with(P.instanceOf(Date), () => "date")
			.with(
				P.when((value): value is URL => value instanceof URL),
				() => "uri",
			)
			.with(P.when(Buffer.isBuffer), () => "binary")
			.with(P.when(Array.isArray), () => "array")
			.otherwise(() => "map")
	}

	private static asBoolean(value: unknown) {
		return match(LLSD.type(value))
			.with("boolean", () => value as boolean)
			.with(
				"integer",
				"real",
				() => (value as number) !== 0 && !Number.isNaN(value as number),
			)
			.with("string", () =>
				match(value)
					.with(P.string.regex(/^true|1$/i), () => true)
					.with(P.string.regex(/^false|0$/i), () => false)
					.with(
						P.string.regex(/^[-+]?([0-9]*\.?[0-9]+)([eE][-+]?[0-9]+)?$/),
						() => Number.parseFloat(value as string) !== 0,
					)
					.otherwise(() => false),
			)
			.otherwise(() => false)
	}

	private static asInteger(value: unknown) {
		return match(LLSD.type(value))
			.with("boolean", () => ((value as boolean) ? 1 : 0))
			.with("integer", () => value as number)
			.with(P.union("string", "real"), (type) => {
				const parsed =
					type === "string"
						? (LLSD.parseFloat(value as string) ?? 0)
						: (value as number)

				const rounded = Number.isNaN(parsed) ? 0 : Math.round(parsed)

				return Math.max(
					Number.MIN_SAFE_INTEGER,
					Math.min(Number.MAX_SAFE_INTEGER, rounded),
				)
			})
			.otherwise(() => 0)
	}

	private static asReal(value: unknown) {
		return match(LLSD.type(value))
			.with("integer", () => value as number)
			.with("real", () => value as number)
			.with("string", () => LLSD.parseFloat(value as string) ?? 0.0)
			.with("boolean", () => ((value as boolean) ? 1.0 : 0.0))
			.otherwise(() => 0.0)
	}

	private static asString(value: unknown) {
		return match(LLSD.type(value))
			.with("string", () => value as string)
			.with("boolean", () => ((value as boolean) ? "1" : "0"))
			.with("integer", () => String(value))
			.with("real", () => LLSD.formatFloat(value as number))
			.with("uuid", () => String(value))
			.with("uri", () => String(value))
			.with("date", () => (value as Date).toJSON())
			.with("binary", () => (value as Buffer).toString("base64"))
			.otherwise(() => "")
	}

	private static asUUID(value: unknown) {
		return match(LLSD.type(value))
			.with("uuid", () => value as UUID)
			.with("string", () => {
				try {
					return new UUID(value as string)
				} catch {
					return new UUID()
				}
			})
			.otherwise(() => new UUID())
	}

	private static asDate(value: unknown) {
		return match(LLSD.type(value))
			.with("date", () => value as Date)
			.with("string", () => {
				try {
					return LLSD.parseISODate(value as string)
				} catch {
					return new Date(0)
				}
			})
			.otherwise(() => new Date(0))
	}

	private static asBinary(value: unknown) {
		return match(LLSD.type(value))
			.with("binary", () => value as Buffer)
			.with("string", () => {
				try {
					return Buffer.from(value as string, "base64")
				} catch {
					return Buffer.alloc(0)
				}
			})
			.otherwise(() => Buffer.alloc(0))
	}
}

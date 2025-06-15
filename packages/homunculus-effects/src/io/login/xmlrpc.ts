import { Data, Effect, pipe } from "effect"

/**
 * Minimal XML-RPC client powered by fetch but wrapped in Effect.
 * – `toXml` converts a JS object into a (very naive) XML-RPC payload.
 * – `fromXml` converts the response back into plain JS objects.
 *
 * NOTE: This is **not** a fully-featured implementation!  It only supports
 * the subset of XML we need for the Second Life `login_to_simulator` call.
 * If the API surface grows we can progressively enhance these helpers.
 */

export class XmlRpcNetworkError extends Data.TaggedError("XmlRpcNetworkError")<{
	readonly message: string
	readonly cause?: unknown
}> {}

function escapeXml(str: string) {
	return /[<>&"]/.test(str) ? `<![CDATA[${str}]]>` : str
}

function formatXml(tag: string, attributes: string, content: string) {
	return content
		? `<${tag}${attributes}>${content}</${tag}>`
		: `<${tag}${attributes}/>`
}

function toXml(json: unknown, field?: string) {
	let result = ""

	if (Array.isArray(json)) {
		for (const node of json) {
			if (field) {
				result += formatXml(field, "", toXml(node))
			} else {
				result += toXml(node)
			}
		}
	} else if (typeof json === "object" && json !== null) {
		const node = json as Record<string, any>
		const attributes: Record<string, string> = {}

		for (const [key, value] of Object.entries(node)) {
			if (key === "attributes") {
				Object.assign(attributes, value)
				continue
			}

			if (value === null) continue

			if (value === undefined) {
				result += formatXml(key, "", "")
				continue
			}

			const inner = toXml(value, key)
			const attrStr = Object.entries(attributes)
				.map(([k, v]) => ` ${k}="${escapeXml(v)}"`)
				.join("")

			if (Array.isArray(value) && value.length > 0 && attrStr === "") {
				result += toXml(value, key)
			} else {
				result += formatXml(key, attrStr, inner)
			}
		}
	} else if (typeof json === "string") {
		return escapeXml(json)
	} else if (typeof json === "boolean") {
		return json ? "1" : "0"
	} else if (json === undefined) {
		return ""
	} else {
		return String(json)
	}

	return result
}

interface XmlNode {
	name: string
	attributes: Record<string, string>
	children: XmlNode[]
	content?: string
}

function fromXml(input: string) {
	let xml = input.trim().replace(/<!--[\s\S]*?-->/g, "")

	const parsedXml = {
		declaration: declaration(),
		root: parseTag() ?? { name: "", attributes: {}, children: [] },
	}

	function declaration() {
		const matches = sliceRegex(/^<\?xml\s*/)

		if (!matches) {
			return undefined
		}

		const node = { attributes: {} as Record<string, string> }

		while (!(endOfString() || isNextPart("?>"))) {
			const attr = parseAttribute()

			if (!attr?.name) {
				return node
			}

			node.attributes[attr.name] = attr.value
		}

		sliceRegex(/\?>\s*/)

		return node
	}

	function parseTag() {
		const matches = sliceRegex(/^<([\w-:.]+)\s*/)

		if (!matches) {
			return undefined
		}

		const node: XmlNode = {
			name: matches[1]!,
			attributes: {},
			children: [],
		}

		while (
			!(
				endOfString() ||
				isNextPart(">") ||
				isNextPart("?>") ||
				isNextPart("/>")
			)
		) {
			const attr = parseAttribute()

			if (!attr) {
				return node
			}

			node.attributes[attr.name] = attr.value
		}

		if (sliceRegex(/^\s*\/>\s*/)) {
			return node
		}

		sliceRegex(/\??>\s*/)

		const nodeContent = sliceRegex(/^([^<]*)/)?.[1] ?? ""

		if (nodeContent.trim()) {
			node.content = nodeContent
		}

		let child = parseTag()

		while (child) {
			node.children.push(child)
			child = parseTag()
		}

		sliceRegex(/^<\/[\w-:.]+>\s*/)

		return node
	}

	function parseAttribute() {
		const matches = sliceRegex(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/)

		return matches
			? { name: matches[1]!, value: matches[2]!.replace(/^['"]|['"]$/g, "") }
			: undefined
	}

	function sliceRegex(re: RegExp) {
		const matches = xml.match(re)

		if (!matches) {
			return undefined
		}

		xml = xml.slice(matches[0].length)

		return matches
	}

	function endOfString() {
		return xml.length === 0
	}

	function isNextPart(prefix: string) {
		return xml.indexOf(prefix) === 0
	}

	function transformNode(node: XmlNode) {
		if (node.name !== "methodResponse") {
			return transformValue(node)
		}

		const params = node.children.find((child) => child.name === "params")

		if (!params) {
			return null
		}

		const param = params.children.find((child) => child.name === "param")

		if (!param) {
			return null
		}

		const value = param.children.find((child) => child.name === "value")

		if (!value) {
			return null
		}

		return transformValue(value)
	}

	function transformValue(node: XmlNode): unknown {
		if (["string", "int", "boolean", "double"].includes(node.name)) {
			const value = node.content

			if (value === undefined || value === "") {
				return null
			}

			switch (node.name) {
				case "int":
					return Number.parseInt(value, 10)
				case "boolean":
					return value === "1" || value === "true"
				case "double":
					return Number.parseFloat(value)
				default:
					return value
			}
		}

		if (node.name === "array") {
			const data = node.children.find((child) => child.name === "data")

			return (data?.children ?? [])
				.map((child) => transformValue(child))
				.filter((item) => item !== null)
		}

		if (node.name === "struct") {
			const members = node.children.filter((child) => child.name === "member")
			const structResult: Record<string, unknown> = {}

			for (const member of members) {
				const nameNode = member.children.find((child) => child.name === "name")

				const valueNode = member.children.find(
					(child) => child.name === "value",
				)

				if (nameNode?.content && valueNode) {
					const firstChild = valueNode.children[0]

					if (firstChild !== undefined) {
						structResult[nameNode.content] = transformValue(firstChild)
					} else {
						structResult[nameNode.content] = transformValue(valueNode)
					}
				}
			}

			return structResult
		}

		if (node.content !== undefined) {
			return node.content === "" ? null : node.content
		}

		if (node.children.length === 0) {
			return null
		}

		const transformed = node.children.map(transformValue)

		return transformed.length === 1 ? transformed[0] : transformed
	}

	return transformNode(parsedXml.root)
}

export function xmlRpc(
	url: string,
	method: string,
	params: Record<string, unknown>,
	headers: Record<string, string> = {},
) {
	const xmlBody =
		'<?xml version="1.0"?>' +
		toXml({
			methodCall: {
				methodName: method,
				params: {
					param: {
						value: {
							struct: {
								member: Object.entries(params).map(([key, value]) => ({
									name: key,
									value:
										value === undefined
											? undefined
											: Array.isArray(value)
												? {
														array: {
															data: {
																value: value.map((v) => ({ string: v })),
															},
														},
													}
												: { [typeof value]: value },
								})),
							},
						},
					},
				},
			},
		})

	return pipe(
		Effect.tryPromise({
			try: (signal) =>
				fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "text/xml",
						Accept: "text/xml",
						"Accept-Charset": "utf-8",
						...headers,
					},
					body: xmlBody,
					signal,
				}),
			catch: (error) =>
				new XmlRpcNetworkError({ message: "Request failed", cause: error }),
		}),
		Effect.andThen((response) => response.text()),
		Effect.map((text) => fromXml(text) as Record<string, unknown>),
	)
}

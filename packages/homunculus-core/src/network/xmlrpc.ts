function escapeXml(str: string): string {
	if (/[<>&"]/.test(str)) {
		return `<![CDATA[${str}]]>`
	}

	return str
}

function formatXml(tag: string, attributes: string, content: string): string {
	if (!content) {
		return `<${tag}${attributes}/>`
	}

	return `<${tag}${attributes}>${content}</${tag}>`
}

function toXml(json: unknown, field?: string): string {
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
		const node = json
		const attributes = {} as Record<string, string>

		for (const [key, value] of Object.entries(node)) {
			if (key === "attributes") {
				Object.assign(attributes, value)
				continue
			}

			if (value === null) {
				continue
			}

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

// loosely based on https://github.com/segmentio/xml-parser
export function fromXml(input: string) {
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

export async function xmlRpc(
	url: string,
	method: string,
	params: Record<string, unknown>,
	headers: Record<string, string>,
) {
	const xml =
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
																value: value.map((item) => ({
																	string: item,
																})),
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

	const response = await fetch(url, {
		headers: {
			"Content-Type": "text/xml",
			Accept: "text/xml",
			"Accept-Charset": "utf-8",
			...headers,
		},
		method: "POST",
		body: xml,
	})

	return fromXml(await response.text())
}

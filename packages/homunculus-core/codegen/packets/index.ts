import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import ejs from "ejs"

interface Field {
	name: string
	type: string
	variable?: boolean
	size?: number
	optional?: boolean
}

interface Block {
	name: string
	fields: Field[]
	variable?: boolean
}

interface Packet {
	name: string
	frequency: number
	id: number
	trusted: boolean
	compression: boolean
	blocks: Block[]
}

enum Frequency {
	Low = 0,
	Medium = 1,
	High = 2,
	Fixed = 3,
}

enum BlockType {
	Single = "Single",
	Variable = "Variable",
	Multiple = "Multiple",
}

const PACKET_HEADER_REGEX =
	/(\w+)\s+(High|Medium|Low|Fixed)\s+(0x[0-9A-Fa-f]+|\d+)\s+(Trusted|NotTrusted)\s+(Zerocoded|Unencoded)/

const BLOCK_HEADER_REGEX =
	/^\s*(\w+)\s+(Single|Variable|Multiple)(?:\s+(\d+))?\s*$/

const FIELD_REGEX =
	/^\s*\{\s*(\w+)\s+(?:(LLUUID|\w+)|Variable(?:\s+(\d+))?)\s*\}(?:\s*\/\/.*)?$/

function toDashCase(value: string): string {
	return value
		.replace(/[_\s]+/g, "-")
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
		.toLowerCase()
}

function toLowerCamel(value: string): string {
	if (value === value.toUpperCase()) {
		return value.toLowerCase()
	}

	if (value.startsWith("UUID")) {
		return value.replace(/^UUID(.*)/, "uuid$1")
	}

	return value
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
		.replace(/([a-z\d])([A-Z])/g, "$1 $2")
		.split(" ")
		.map((word, i) =>
			i === 0
				? word.charAt(0).toLowerCase() + word.slice(1)
				: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
		)
		.join("")
}

function parseFrequency(frequency: string): Frequency {
	switch (frequency) {
		case "High":
			return Frequency.High

		case "Medium":
			return Frequency.Medium

		case "Low":
			return Frequency.Low

		case "Fixed":
			return Frequency.Fixed

		default:
			throw new Error(`Invalid frequency: ${frequency}`)
	}
}

function isOptionalAgentDataField(fieldName: string): boolean {
	const optionalFields = [
		"agentId",
		"sessionId",
		"circuitCode",
		"estateId",
		"godLevel",
		"godlike",
		"flags",
	]

	return optionalFields.includes(fieldName)
}

function shouldMakeAgentDataOptional(block: Block): boolean {
	if (block.name !== "agentData") {
		return false
	}

	return block.fields.every((field) => isOptionalAgentDataField(field.name))
}

function getTypeScriptType(type: string): string {
	if (type === "Bool") {
		return "boolean"
	}

	if (type === "UUID" || type.startsWith("Variable")) {
		return "string | Buffer"
	}

	if (type === "U64") {
		return "number | bigint"
	}

	if (type === "Fixed") {
		return "Buffer"
	}

	if (
		type === "IPPORT" ||
		["U8", "U16", "U32", "U64", "S8", "S16", "S32", "F32", "F64"].includes(type)
	) {
		return "number"
	}

	if (
		[
			"IP",
			"Port",
			"Color4",
			"Vector3",
			"Vector3D",
			"Vector4",
			"Quaternion",
		].includes(type)
	) {
		return `Types.${type}`
	}

	if (type === "Vector3d") {
		return "Types.Vector3D"
	}

	throw new Error(`Unknown type: ${type}`)
}

function parseField(line: string, blockName: string): Field {
	const fieldMatch = line.match(FIELD_REGEX)

	if (!fieldMatch) {
		throw new Error(
			`Failed to parse field line: '${line}' in block ${blockName}`,
		)
	}

	const [, name, type = "Variable", size] = fieldMatch

	let fieldType = type
	let isVariable = false
	let isOptional = false

	if (type === "Variable") {
		isVariable = true
		fieldType = size ? `Variable${size}` : "Variable"
	} else if (type === "LLUUID") {
		fieldType = "UUID"
	} else if (type === "BOOL") {
		fieldType = "Bool"
	} else if (type.startsWith("LL")) {
		fieldType = type.replace("LL", "")

		if (fieldType === "Vector3d") {
			fieldType = "Vector3D"
		}
	} else if (type === "IPADDR") {
		fieldType = "IP"
	} else if (type === "IPPORT") {
		fieldType = "Port"
	}

	if (blockName === "agentData") {
		isOptional = isOptionalAgentDataField(toLowerCamel(name))
	}

	return {
		name: toLowerCamel(name),
		type: fieldType,
		variable: isVariable,
		size: size ? Number.parseInt(size) : undefined,
		optional: isOptional,
	}
}

function parseBlock(
	lines: string[],
	startIndex: number,
): { block: Block; endIndex: number } {
	let i = startIndex

	while (i < lines.length && lines[i].trim() === "{") {
		i++
	}

	const line = lines[i].trim()

	console.log(`Parsing block header: '${line}'`)

	const blockHeaderMatch = line.match(BLOCK_HEADER_REGEX)

	if (!blockHeaderMatch) {
		console.log(`Failed to match block header regex: ${BLOCK_HEADER_REGEX}`)

		throw new Error(`Invalid block header at line ${i + 1}: '${line}'`)
	}

	const [, name, type, count] = blockHeaderMatch

	console.log(
		`Matched block header: name=${name}, type=${type}, count=${count}`,
	)

	const block: Block = {
		name: toLowerCamel(name),
		fields: [],
		variable: type === BlockType.Variable || type === BlockType.Multiple,
	}

	i++

	while (i < lines.length) {
		const line = lines[i].trim()

		if (line === "}") {
			return { block, endIndex: i }
		}

		if (line && !line.startsWith("//")) {
			try {
				block.fields.push(parseField(line, block.name))
			} catch (error) {
				console.error(`Error parsing field in block ${block.name}:`, error)
			}
		}

		i++
	}

	throw new Error(`Block ${block.name} not properly closed`)
}

function parseMessageTemplate(content: string): Packet[] {
	const packets: Packet[] = []
	const lines = content.split("\n")

	let i = 0

	while (i < lines.length) {
		const line = lines[i].trim()

		if (!line || line.startsWith("//")) {
			i++
			continue
		}

		if (line.startsWith("{")) {
			const packetMatch = lines[i + 1]?.trim().match(PACKET_HEADER_REGEX)

			if (!packetMatch) {
				i++
				continue
			}

			const [, name, frequency, id, trusted, compression] = packetMatch

			console.log(`Found packet: ${name}`)
			console.log(`Raw ID: ${id}`)

			const packet: Packet = {
				name: name === "Error" ? "GenericError" : name,
				frequency: parseFrequency(frequency),
				id: id.startsWith("0x")
					? Number.parseInt(id.slice(2), 16)
					: Number.parseInt(id),
				trusted: trusted === "Trusted",
				compression: compression === "Zerocoded",
				blocks: [],
			}

			console.log(`Parsed ID: ${packet.id}`)

			// skip header and opening brace
			i += 2

			while (i < lines.length) {
				const blockLine = lines[i].trim()
				if (blockLine === "}") {
					packets.push(packet)
					i++
					break
				}

				if (blockLine && !blockLine.startsWith("//")) {
					try {
						const { block, endIndex } = parseBlock(lines, i)

						packet.blocks.push(block)

						i = endIndex + 1
					} catch (error) {
						console.error(
							`Error parsing block in packet ${packet.name}:`,
							error,
						)

						i++
					}
				} else {
					i++
				}
			}
		} else {
			i++
		}
	}

	return packets
}

async function generatePackets() {
	try {
		const templateContent = readFileSync(
			join(import.meta.dirname, "message_template.msg"),
			"utf-8",
		)

		const packets = parseMessageTemplate(templateContent)

		const ejsTemplate = readFileSync(
			join(import.meta.dirname, "packet-template.ts.ejs"),
			"utf-8",
		)

		const lookupTemplate = readFileSync(
			join(import.meta.dirname, "packet-lookup-template.ts.ejs"),
			"utf-8",
		)

		const outputDir = join(
			import.meta.dirname,
			"..",
			"..",
			"src",
			"network",
			"packets",
		)

		// Generate individual packet files
		for (const packet of packets) {
			// console.log(`Processing packet: ${packet.name}`)
			// console.log("Blocks:", JSON.stringify(packet.blocks, null, 2))

			const output = ejs.render(ejsTemplate, {
				packetName: packet.name,
				packetId: packet.id,
				frequency: packet.frequency,
				trusted: packet.trusted,
				compression: packet.compression,
				blocks: packet.blocks,

				// utilities
				shouldMakeAgentDataOptional,
				getTypeScriptType,
			})

			writeFileSync(join(outputDir, `${toDashCase(packet.name)}.ts`), output)
		}

		const indexContent = packets
			.map((packet) => `export * from "./${toDashCase(packet.name)}"`)
			.concat(["export * from './packet'"])
			.join("\n")

		writeFileSync(join(outputDir, "index.ts"), indexContent)

		const lookupOutput = ejs.render(lookupTemplate, {
			packets: packets.sort((a, b) => a.id - b.id),
		})

		writeFileSync(
			join(
				import.meta.dirname,
				"..",
				"..",
				"src",
				"network",
				"helpers",
				"packet-lookup.ts",
			),
			lookupOutput,
		)
	} catch (error) {
		console.error("Error generating packets:", error)
		throw error
	}
}

generatePackets().catch(console.error)

import assert from "node:assert"
import { services } from "~/services"
import { toLowerCamel } from "../utilities/to-lower-camel"
import type { DelegateConfig } from "./delegate"
import { Quaternion, type Type, Vector3, Vector3D, Vector4 } from "./types"

export interface PacketBlock {
	name: string
	parameters: Array<[name: string, type: { toBuffer: (value: any) => Buffer }]>
	multiple?: true
	size?: number
}

export interface PacketMetadata {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	id: number

	/**
	 * Packet name, this is used mainly just to identify the packet in debugging.
	 */
	name: string

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 *
	 * 0: High (undefined)
	 * 1: Medium
	 * 2: Low
	 * 3: Fixed
	 *
	 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
	 */
	frequency?: 1 | 2 | 3

	/**
	 * If this value is true, the client cannot send this packet as circuits only
	 * accept trusted packets from internal connections (to utility servers etc).
	 */
	trusted?: true

	/**
	 * States if this packet should use or be using zero-coding, to attempt to
	 * compress the sequences of zeros in the message in order to reduce network
	 * load.
	 */
	compression?: true

	/**
	 * Reliable flag, suggests that this packet should be sent reliably.
	 */
	reliable?: true

	/**
	 * Determines the blocks that are are contained in the message and it's
	 * required parameters.
	 *
	 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
	 */
	blocks?: Array<PacketBlock>
}

export interface Packet<T extends object> {
	data: T
	reliable?: boolean
	metadata: PacketMetadata
}

export function createPacketSender<T extends object>(metadata: PacketMetadata) {
	return (data: T, reliable?: boolean) =>
		({ data, reliable, metadata }) satisfies Packet<T>
}

export function createPacketDelegate<T extends object>(
	metadata: PacketMetadata,
) {
	return (config: Omit<DelegateConfig<T>, "metadata">) =>
		services.delegate.register<T>({ ...config, metadata })
}

/**
 * Utility function to "safely" convert an LLSD value to the expected packet.
 */
function safeConvertValue(
	value: any,
	expectedType: Type,
	llsdKey: string,
	paramName: string,
): any {
	// handle basic type validation
	// TODO: validate the expected type first
	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean" ||
		value === null ||
		value === undefined ||
		value instanceof Buffer
	) {
		return value
	}

	// handle vector3/vector3d conversion
	if (expectedType === Vector3 || expectedType === Vector3D) {
		assert.ok(Array.isArray(value), "Expected array")
		assert.ok(value.length === 3, "Expected array length of 3")

		const [x, y, z] = value

		if (
			typeof x === "number" &&
			typeof y === "number" &&
			typeof z === "number"
		) {
			return expectedType === Vector3
				? new Vector3(x, y, z)
				: new Vector3D(x, y, z)
		}

		return expectedType === Vector3 ? Vector3.zero : Vector3D.zero
	}

	// handle vector4/quaternion conversion
	if (expectedType === Vector4 || expectedType === Quaternion) {
		assert.ok(Array.isArray(value), "Expected array")
		assert.ok(value.length === 4, "Expected array length of 4")

		const [x, y, z, w] = value

		if (
			typeof x === "number" &&
			typeof y === "number" &&
			typeof z === "number" &&
			typeof w === "number"
		) {
			return expectedType === Vector4
				? new Vector4(x, y, z, w)
				: new Quaternion(x, y, z, w)
		}

		return expectedType === Vector4 ? Vector4.zero : Quaternion.identity
	}

	throw new Error(
		`Unsupported value type for ${llsdKey} -> ${paramName}: ${typeof value}`,
	)
}

/**
 * Maps an LLSD event queue message to packet data format using packet metadata.
 *
 * @param metadata The packet metadata containing block and parameter definitions.
 * @param eventMessage The LLSD event queue message.
 * @returns Mapped packet data object with only safely converted fields.
 */
export function mapEventQueuePacketData<T extends object>(
	metadata: PacketMetadata,
	message: string,
	body: any,
) {
	const result: any = {}

	assert.ok(message === metadata.name, "Invalid event queue message type")

	// map each block defined in the metadata
	for (const block of metadata.blocks || []) {
		// TODO: probably better to use toLowerCamel in the opposite direction
		const blockNamePascal =
			block.name.charAt(0).toUpperCase() + block.name.slice(1)

		const llsdBlockData = body[blockNamePascal]

		// TODO: some blocks can have multiple array values, we should handle that
		if (llsdBlockData && Array.isArray(llsdBlockData) && llsdBlockData[0]) {
			const blockData = llsdBlockData[0]
			const mappedBlock: any = {}

			// map each parameter in the block
			for (const [paramName, paramType] of block.parameters || []) {
				// find the corresponding LLSD field
				let mappedValue: any
				let llsdKeyFound = false

				for (const [llsdKey, value] of Object.entries(blockData)) {
					if (paramName === toLowerCamel(llsdKey)) {
						llsdKeyFound = true

						// validate and convert the value safely
						const convertedValue = safeConvertValue(
							value,
							paramType,
							llsdKey,
							paramName,
						)

						if (convertedValue !== undefined) {
							mappedValue = convertedValue
						}

						break
					}
				}

				assert(llsdKeyFound, `Missing LLSD key: ${paramName}`)

				mappedBlock[paramName] = mappedValue
			}

			assert(Object.keys(mappedBlock).length > 0, `Empty block: ${block.name}`)

			result[block.name] = mappedBlock
		}
	}

	return result as T
}

import assert from "node:assert"
import { Buffer } from "node:buffer"
import { randomUUID } from "node:crypto"

class UUID {
	public static readonly size = 16
	public static readonly zero = "00000000-0000-0000-0000-000000000000"

	/**
	 * Converts string input into a buffer representing a UUID.
	 *
	 * @todo Optimize this, it's probably not that good.
	 * @param uuid UUID string to convert.
	 */
	public static toBuffer(uuid: string | Buffer) {
		if (Buffer.isBuffer(uuid)) {
			assert(uuid.length === 16, "Buffer must be exactly 16 bytes for a UUID")

			return uuid
		}

		assert(UUID.validate(uuid), `Invalid UUID string: ${uuid}`)

		return Buffer.from(uuid.replace(/-/g, ""), "hex")
	}

	/**
	 * Converts buffer input into a UUID string.
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 */
	public static fromBuffer(buffer: Buffer, position = 0) {
		const hex = buffer.toString("hex", position, position + UUID.size)
		const output = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`

		assert(
			UUID.validate(output),
			`Invalid UUID string generated from buffer: ${output}`,
		)

		return output
	}

	/**
	 * Generates a random UUID (using `node:crypto.randomUUID`).
	 */
	public static random() {
		return randomUUID()
	}

	/**
	 * Validates if a string is in UUID format.
	 *
	 * This is a loose validation that only checks the format, not the actual values.
	 *
	 * @param uuid String to validate.
	 * @returns boolean indicating if the string is a valid UUID format.
	 */
	public static validate(uuid: string) {
		return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
			uuid,
		)
	}
}

export default UUID

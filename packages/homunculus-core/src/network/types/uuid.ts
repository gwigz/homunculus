import { randomUUID } from "node:crypto"

class UUID {
	public static readonly size: number = 16
	public static readonly zero: string = "00000000-0000-0000-0000-000000000000"

	/**
	 * Converts string input into a buffer representing a UUID.
	 *
	 * @todo Optimize this, it's probably not that good
	 * @param uuid UUID string to convert
	 */
	public static toBuffer(uuid: string | Buffer): Buffer {
		if (typeof uuid !== "string") {
			return uuid
		}

		const bytes = []
		const parts = uuid.split("-")

		for (const part of parts) {
			for (let c = 0; c < part.length; c += 2) {
				bytes.push(Number.parseInt(part.substr(c, 2), 16))
			}
		}

		return Buffer.from(bytes)
	}

	/**
	 * Converts buffer input into a UUID string.
	 *
	 * @todo Optimize this, it's probably not that good
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 */
	public static fromBuffer(buffer: Buffer, position = 0): string {
		let output = ""
		let i = position

		for (let c = 0; c < 16; c++) {
			output += UUID.pad(buffer.readUInt8(i++).toString(16), 2)

			if (c === 3 || c === 5 || c === 7 || c === 9) {
				output += "-"
			}
		}

		return output
	}

	/**
	 * Zero padding helper function, may be moved.
	 *
	 * @param value Character to pad
	 * @param width Number of characters to zero pad
	 */
	public static pad(value: string, width: number): string {
		const size = width - value.length

		return size > 0
			? new Array(size + (/\./.test(value) ? 2 : 1)).join("0") + value
			: `${value}`
	}

	/**
	 * Generates a random UUID (using `node:crypto.randomUUID`).
	 */
	public static random(): string {
		return randomUUID()
	}
}

export default UUID

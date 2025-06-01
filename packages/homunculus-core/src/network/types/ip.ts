import { Buffer } from "node:buffer"

class IP {
	public static readonly size: number = 4

	/**
	 * Converts an IP address (string) input into a buffer, one place per byte, 4
	 * bytes wide.
	 *
	 * @param {string} string IP address string to convert
	 * @returns {Buffer}
	 */
	public static toBuffer(string: string): Buffer {
		const ip = string.split(".")
		const buffer = Buffer.allocUnsafe(IP.size)

		buffer.writeUInt8(Number.parseInt(ip[0] ?? "0", 10), 0)
		buffer.writeUInt8(Number.parseInt(ip[1] ?? "0", 10), 1)
		buffer.writeUInt8(Number.parseInt(ip[2] ?? "0", 10), 2)
		buffer.writeUInt8(Number.parseInt(ip[3] ?? "0", 10), 3)

		return buffer
	}

	/**
	 * Converts buffer input into a string representing an IP address
	 *
	 * @param buffer Buffer to convert
	 * @param position Position to read from
	 * @returns {string}
	 */
	public static fromBuffer(buffer: Buffer, position = 0): string {
		return [
			buffer.readUInt8(position),
			buffer.readUInt8(position + 1),
			buffer.readUInt8(position + 2),
			buffer.readUInt8(position + 3),
		].join(".")
	}
}

export default IP

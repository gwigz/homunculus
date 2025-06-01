/** biome-ignore-all lint/complexity/noThisInStatic: using values from extended classes */
import { Buffer } from "node:buffer"

abstract class Fixed {
	public static size: number

	/**
	 * Pads buffer bytes of fixed length if necessary.
	 *
	 * @param buffer This will truncate or pad if necessary
	 */
	public static toBuffer(buffer: Buffer) {
		if (buffer.length === this.size) {
			return buffer
		}

		if (buffer.length > this.size) {
			return buffer.subarray(0, this.size)
		}

		const output = Buffer.alloc(this.size)

		buffer.copy(output, 0, 0, Math.min(buffer.length, this.size))

		return output
	}

	/**
	 * Extracts bytes for fixed length from the buffer.
	 *
	 * @param buffer Buffer to handle
	 * @param start Position to read from
	 */
	public static fromBuffer(buffer: Buffer, start: number) {
		return buffer.subarray(start, start + this.size)
	}
}

export default Fixed

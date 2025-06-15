export const ACK = 0x40
export const FREQUENCY_OFFSETS = [7, 8, 10, 10]

/**
 * Generates the header for a packet.
 *
 * @see {@link http://wiki.secondlife.com/wiki/Packet_Layout}
 * @example
 * ```
 *         [   header   ] [ msg num ] [ data ]
 * High:   .. .. .. .. .. XX .. .. .. .. .. ..
 * Medium: .. .. .. .. .. FF XX .. .. .. .. ..
 * Low:    .. .. .. .. .. FF FF XX XX .. .. ..
 * Fixed:  .. .. .. .. .. FF FF FF XX .. .. ..
 * ```
 */
export function encodeHeader(
	buffer: Buffer,
	id: number,
	frequency: number,
	sequence: number,
	reliable = false,
) {
	// flags
	buffer[0] = reliable ? ACK : 0

	// sequence number
	buffer[1] = sequence >> 24
	buffer[2] = sequence >> 16
	buffer[3] = sequence >> 8
	buffer[4] = sequence

	// extra header bytes
	buffer[5] = 0

	// packet id
	switch (frequency) {
		case 0:
			buffer[6] = id & 0xff
			break

		case 1:
			buffer[6] = 0xff
			buffer[7] = id & 0xff
			break

		case 2:
			buffer[6] = 0xff
			buffer[7] = 0xff
			buffer[8] = (id >> 8) & 0xff
			buffer[9] = id & 0xff
			break

		default:
			buffer[6] = 0xff
			buffer[7] = 0xff
			buffer[8] = 0xff
			buffer[9] = id & 0xff
			break
	}
}

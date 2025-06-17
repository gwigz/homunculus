export interface PacketHeader {
	ack: boolean
	reliable: boolean
	sequence: number
	frequency: 0 | 1 | 2 | 3
	id: number
	offset: number
}

export const ACK = 0x10
export const RELIABLE = 0x20
export const ZERO_CODED = 0x80

const FREQUENCY_OFFSETS = [1, 2, 4, 4] as const

/** @internal */
export function decodeHeader(buffer: Buffer): PacketHeader {
	const ack = (buffer[0]! & ACK) === ACK
	const reliable = (buffer[0]! & RELIABLE) === RELIABLE
	const zerocoded = (buffer[0]! & ZERO_CODED) === ZERO_CODED

	const sequence =
		(buffer[1]! << 24) | (buffer[2]! << 16) | (buffer[3]! << 8) | buffer[4]!

	// skip extra header bytes
	let start = 6 + buffer.readUInt8(5)

	let id: Buffer | number = zerocoded
		? Buffer.alloc(4)
		: buffer.subarray(start, start + 4)

	// the message ID can be zero-coded, in that case, we need to parse it
	if (zerocoded) {
		const length = buffer.length

		let write = 0

		while (write < 4 && start < length) {
			const byte = buffer[start]

			if (byte === 0) {
				const zeros = Math.min(buffer[start + 1] || 0, 4 - write)

				id.fill(0, write, write + zeros)
				write += zeros
				start += 2
			} else {
				id[write++] = byte!
				start++
			}
		}
	}

	let frequency = 0 as PacketHeader["frequency"]

	while (frequency < 3 && id[frequency] === 0xff) {
		frequency++
	}

	const offset = start + FREQUENCY_OFFSETS[frequency]!

	switch (frequency) {
		case 0:
		case 1:
			id = id[frequency]!
			break
		case 2:
			id = (id[2]! << 8) | (id[3] ?? 0)
			break
		case 3:
			id =
				((id[0]! << 24) >>> 0) +
				((id[1]! << 16) >>> 0) +
				((id[2]! << 8) >>> 0) +
				(id[3] ?? 0)
			break
	}

	return { reliable, sequence: sequence >>> 0, frequency, id, offset, ack }
}

/** @internal */
export function decodeAppendedAcks(buffer: Buffer) {
	if ((buffer[0]! & ACK) !== ACK) {
		return []
	}

	const length = buffer.readUInt8(buffer.length - 1)
	const start = buffer.length - (length * 4 + 1)

	return Array.from({ length }, (_, i) => buffer.readUInt32BE(start + i * 4))
}

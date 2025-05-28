import { services } from "~/services"
import type { DelegateConfig } from "../delegate"

export interface PacketBlock {
	name: string
	parameters: Array<[name: string, type: { toBuffer: (value: any) => Buffer }]>
	multiple?: true
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
		({
			data,
			reliable,
			metadata,
		}) satisfies Packet<T>
}

export function createPacketDelegate<T extends object>(
	metadata: PacketMetadata,
) {
	return (config: Omit<DelegateConfig<T>, "metadata">) =>
		services.delegate.register<T>({
			...config,
			metadata,
		})
}

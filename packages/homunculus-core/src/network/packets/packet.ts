import assert from "node:assert"

export class Packet<T extends object> {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id: number

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 *
	 * 0: Low
	 * 1: Medium
	 * 2: High
	 * 3: Fixed
	 */
	public static frequency: number

	/**
	 * If this value is true, the client cannot send this packet as circuits only
	 * accept trusted packets from internal connections (to utility servers etc).
	 */
	public static trusted: boolean

	/**
	 * States if this packet should use or be using zero-coding, to attempt to
	 * compress the sequences of zeros in the message in order to reduce network
	 * load.
	 */
	public static compression: boolean

	/**
	 * Determines the blocks that are are contained in the message and it's
	 * required parameters.
	 *
	 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
	 */
	public static format: Map<string, any>

	public index?: number
	public reliable?: boolean
	public data: T

	constructor(data: T) {
		assert.notEqual(
			this.constructor,
			Packet,
			"Do not instantiate from the packet class, use extended classes!",
		)

		this.data = data
	}
}

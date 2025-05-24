import * as Types from "../types"
import Packet from "./packet"

/**
 * LoadURL Packet
 */
class LoadURL extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static override id = 194

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 */
	public static override frequency = 0

	/**
	 * If this value is true, the client cannot send this packet as circuits only
	 * accept trusted packets from internal connections (to utility servers etc).
	 */
	public static override trusted = true

	/**
	 * States if this packet should use or be using zerocoding, to attempt to
	 * compress the sequences of zeros in the message in order to reduce network
	 * load.
	 */
	public static override compression = false

	/**
	 * Determines the blocks that are are contained in the message and it's
	 * required parameters.
	 *
	 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
	 */
	public static override format: Map<string, any> = new Map([
		[
			"data",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["objectName", Types.Variable1],
					["object", Types.UUID],
					["owner", Types.UUID],
					["ownerIsGroup", Types.Boolean],
					["message", Types.Variable1],
					["url", Types.Variable1],
				]),
			},
		],
	])

	/**
	 * LoadURL constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link LoadURL.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {Variable1} [data.data.objectName] ObjectName
	 * @param {string} [data.data.object] ObjectID
	 * @param {string} [data.data.owner] OwnerID
	 * @param {boolean} [data.data.ownerIsGroup] OwnerIsGroup
	 * @param {Variable1} [data.data.message] Message
	 * @param {Variable1} [data.data.url] URL
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default LoadURL

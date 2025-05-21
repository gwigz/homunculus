import * as Types from "../types"
import Packet from "./packet"

/**
 * DirPlacesReply Packet
 */
class DirPlacesReply extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 35

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 */
	public static frequency = 0

	/**
	 * If this value is true, the client cannot send this packet as circuits only
	 * accept trusted packets from internal connections (to utility servers etc).
	 */
	public static trusted = true

	/**
	 * States if this packet should use or be using zerocoding, to attempt to
	 * compress the sequences of zeros in the message in order to reduce network
	 * load.
	 */
	public static compression = true

	/**
	 * Determines the blocks that are are contained in the message and it's
	 * required parameters.
	 *
	 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
	 */
	public static format: Map<string, any> = new Map([
		[
			"agentData",
			{
				quantity: 1,
				parameters: new Map<string, any>([["agent", Types.UUID]]),
			},
		],
		[
			"queryData",
			{ parameters: new Map<string, any>([["query", Types.UUID]]) },
		],
		[
			"queryReplies",
			{
				parameters: new Map<string, any>([
					["parcel", Types.UUID],
					["name", Types.Variable1],
					["forSale", Types.Boolean],
					["auction", Types.Boolean],
					["dwell", Types.F32],
				]),
			},
		],
		[
			"statusData",
			{ parameters: new Map<string, any>([["status", Types.U32]]) },
		],
	])

	/**
	 * DirPlacesReply constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link DirPlacesReply.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.queryData.query] QueryID
	 * @param {string} [data.queryReplies.parcel] ParcelID
	 * @param {Variable1} [data.queryReplies.name] Name
	 * @param {boolean} [data.queryReplies.forSale] ForSale
	 * @param {boolean} [data.queryReplies.auction] Auction
	 * @param {F32} [data.queryReplies.dwell] Dwell
	 * @param {U32} [data.statusData.status] Status
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default DirPlacesReply

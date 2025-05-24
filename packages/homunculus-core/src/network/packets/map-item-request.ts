import * as Types from "../types"
import Packet from "./packet"

/**
 * MapItemRequest Packet
 */
class MapItemRequest extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static override id = 410

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
	public static override trusted = false

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
			"agentData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["agent", Types.UUID],
					["session", Types.UUID],
					["flags", Types.U32],
					["estate", Types.U32],
					["godlike", Types.Boolean],
				]),
			},
		],
		[
			"requestData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["itemType", Types.U32],
					["regionHandle", Types.U64],
				]),
			},
		],
	])

	/**
	 * MapItemRequest constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link MapItemRequest.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {U32} [data.agentData.flags] Flags
	 * @param {U32} [data.agentData.estate] EstateID
	 * @param {boolean} [data.agentData.godlike] Godlike
	 * @param {U32} [data.requestData.itemType] ItemType
	 * @param {U64} [data.requestData.regionHandle] RegionHandle
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default MapItemRequest

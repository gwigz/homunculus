import Packet from "./packet"

import * as Types from "../types"

/**
 * MapItemReply Packet
 */
class MapItemReply extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 411

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
	public static compression = false

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
				parameters: new Map<string, any>([
					["agent", Types.UUID],
					["flags", Types.U32],
				]),
			},
		],
		[
			"requestData",
			{
				quantity: 1,
				parameters: new Map<string, any>([["itemType", Types.U32]]),
			},
		],
		[
			"data",
			{
				parameters: new Map<string, any>([
					["x", Types.U32],
					["y", Types.U32],
					["id", Types.UUID],
					["extra", Types.S32],
					["extra2", Types.S32],
					["name", Types.Variable1],
				]),
			},
		],
	])

	/**
	 * MapItemReply constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link MapItemReply.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {U32} [data.agentData.flags] Flags
	 * @param {U32} [data.requestData.itemType] ItemType
	 * @param {U32} [data.data.x] X
	 * @param {U32} [data.data.y] Y
	 * @param {string} [data.data.id] ID
	 * @param {S32} [data.data.extra] Extra
	 * @param {S32} [data.data.extra2] Extra2
	 * @param {Variable1} [data.data.name] Name
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default MapItemReply

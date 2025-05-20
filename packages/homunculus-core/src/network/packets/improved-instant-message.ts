import Packet from "./packet"

import * as Types from "../types"

/**
 * ImprovedInstantMessage Packet
 */
class ImprovedInstantMessage extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 254

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
	public static trusted = false

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
				parameters: new Map<string, any>([
					["agent", Types.UUID],
					["session", Types.UUID],
				]),
			},
		],
		[
			"messageBlock",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["fromGroup", Types.Boolean],
					["toAgent", Types.UUID],
					["parentEstate", Types.U32],
					["region", Types.UUID],
					["position", Types.Vector3],
					["offline", Types.U8],
					["dialog", Types.U8],
					["id", Types.UUID],
					["timestamp", Types.U32],
					["fromAgentName", Types.Variable1],
					["message", Types.Variable2],
					["binaryBucket", Types.Variable2],
				]),
			},
		],
	])

	/**
	 * ImprovedInstantMessage constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ImprovedInstantMessage.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {boolean} [data.messageBlock.fromGroup] FromGroup
	 * @param {string} [data.messageBlock.toAgent] ToAgentID
	 * @param {U32} [data.messageBlock.parentEstate] ParentEstateID
	 * @param {string} [data.messageBlock.region] RegionID
	 * @param {Vector3} [data.messageBlock.position] Position
	 * @param {U8} [data.messageBlock.offline] Offline
	 * @param {U8} [data.messageBlock.dialog] Dialog
	 * @param {string} [data.messageBlock.id] ID
	 * @param {U32} [data.messageBlock.timestamp] Timestamp
	 * @param {Variable1} [data.messageBlock.fromAgentName] FromAgentName
	 * @param {Variable2} [data.messageBlock.message] Message
	 * @param {Variable2} [data.messageBlock.binaryBucket] BinaryBucket
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ImprovedInstantMessage

import { Collection } from "../../utilities"
import Packet from "./packet"

import * as Types from "../types"

/**
 * GroupNoticeAdd Packet
 */
class GroupNoticeAdd extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 *
	 * @type {number}
	 */
	public static id = 61

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 *
	 * @type {number}
	 */
	public static frequency = 0

	/**
	 * If this value is true, the client cannot send this packet as circuits only
	 * accept trusted packets from internal connections (to utility servers etc).
	 *
	 * @type {boolean}
	 */
	public static trusted = true

	/**
	 * States if this packet should use or be using zerocoding, to attempt to
	 * compress the sequences of zeros in the message in order to reduce network
	 * load.
	 *
	 * @type {boolean}
	 */
	public static compression = false

	/**
	 * Determines the blocks that are are contained in the message and it's
	 * required parameters.
	 *
	 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
	 * @type {Collection}
	 */
	public static format: Collection<string, any> = new Collection([
		// tslint:disable-next-line:max-line-length
		[
			"agentData",
			{
				quantity: 1,
				parameters: new Collection<string, any>([["agent", Types.UUID]]),
			},
		],
		// tslint:disable-next-line:max-line-length
		[
			"messageBlock",
			{
				quantity: 1,
				parameters: new Collection<string, any>([
					["toGroup", Types.UUID],
					["id", Types.UUID],
					["dialog", Types.U8],
					["fromAgentName", Types.Variable1],
					["message", Types.Variable2],
					["binaryBucket", Types.Variable2],
				]),
			},
		],
	])

	/**
	 * GroupNoticeAdd constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link GroupNoticeAdd.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.messageBlock.toGroup] ToGroupID
	 * @param {string} [data.messageBlock.id] ID
	 * @param {U8} [data.messageBlock.dialog] Dialog
	 * @param {Variable1} [data.messageBlock.fromAgentName] FromAgentName
	 * @param {Variable2} [data.messageBlock.message] Message
	 * @param {Variable2} [data.messageBlock.binaryBucket] BinaryBucket
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default GroupNoticeAdd

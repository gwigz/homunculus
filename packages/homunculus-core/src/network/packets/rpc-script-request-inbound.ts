import * as Types from "../types"
import Packet from "./packet"

/**
 * RpcScriptRequestInbound Packet
 */
class RpcScriptRequestInbound extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 415

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
	public static compression = false

	/**
	 * Determines the blocks that are are contained in the message and it's
	 * required parameters.
	 *
	 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
	 */
	public static format: Map<string, any> = new Map([
		[
			"targetBlock",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["gridX", Types.U32],
					["gridY", Types.U32],
				]),
			},
		],
		[
			"dataBlock",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["task", Types.UUID],
					["item", Types.UUID],
					["channel", Types.UUID],
					["intValue", Types.U32],
					["stringValue", Types.Variable2],
				]),
			},
		],
	])

	/**
	 * RpcScriptRequestInbound constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link RpcScriptRequestInbound.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {U32} [data.targetBlock.gridX] GridX
	 * @param {U32} [data.targetBlock.gridY] GridY
	 * @param {string} [data.dataBlock.task] TaskID
	 * @param {string} [data.dataBlock.item] ItemID
	 * @param {string} [data.dataBlock.channel] ChannelID
	 * @param {U32} [data.dataBlock.intValue] IntValue
	 * @param {Variable2} [data.dataBlock.stringValue] StringValue
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default RpcScriptRequestInbound

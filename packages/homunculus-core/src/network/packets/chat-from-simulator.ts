import * as Types from "../types"
import Packet from "./packet"

/**
 * ChatFromSimulator Packet
 */
class ChatFromSimulator extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 139

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
			"chatData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["fromName", Types.Variable1],
					["source", Types.UUID],
					["owner", Types.UUID],
					["sourceType", Types.U8],
					["chatType", Types.U8],
					["audible", Types.U8],
					["position", Types.Vector3],
					["message", Types.Variable2],
				]),
			},
		],
	])

	/**
	 * ChatFromSimulator constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ChatFromSimulator.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {Variable1} [data.chatData.fromName] FromName
	 * @param {string} [data.chatData.source] SourceID
	 * @param {string} [data.chatData.owner] OwnerID
	 * @param {U8} [data.chatData.sourceType] SourceType
	 * @param {U8} [data.chatData.chatType] ChatType
	 * @param {U8} [data.chatData.audible] Audible
	 * @param {Vector3} [data.chatData.position] Position
	 * @param {Variable2} [data.chatData.message] Message
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ChatFromSimulator

import * as Types from "../types"
import Packet from "./packet"

/**
 * ChatPass Packet
 */
class ChatPass extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 239

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
			"chatData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["channel", Types.S32],
					["position", Types.Vector3],
					["id", Types.UUID],
					["owner", Types.UUID],
					["name", Types.Variable1],
					["sourceType", Types.U8],
					["type", Types.U8],
					["radius", Types.F32],
					["simAccess", Types.U8],
					["message", Types.Variable2],
				]),
			},
		],
	])

	/**
	 * ChatPass constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ChatPass.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {S32} [data.chatData.channel] Channel
	 * @param {Vector3} [data.chatData.position] Position
	 * @param {string} [data.chatData.id] ID
	 * @param {string} [data.chatData.owner] OwnerID
	 * @param {Variable1} [data.chatData.name] Name
	 * @param {U8} [data.chatData.sourceType] SourceType
	 * @param {U8} [data.chatData.type] Type
	 * @param {F32} [data.chatData.radius] Radius
	 * @param {U8} [data.chatData.simAccess] SimAccess
	 * @param {Variable2} [data.chatData.message] Message
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ChatPass

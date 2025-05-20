import * as Types from "../types"
import Packet from "./packet"

/**
 * RequestImage Packet
 */
class RequestImage extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 8

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 */
	public static frequency = 2

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
			"requestImage",
			{
				parameters: new Map<string, any>([
					["image", Types.UUID],
					["discardLevel", Types.S8],
					["downloadPriority", Types.F32],
					["packet", Types.U32],
					["type", Types.U8],
				]),
			},
		],
	])

	/**
	 * RequestImage constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link RequestImage.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {string} [data.requestImage.image] Image
	 * @param {S8} [data.requestImage.discardLevel] DiscardLevel
	 * @param {F32} [data.requestImage.downloadPriority] DownloadPriority
	 * @param {U32} [data.requestImage.packet] Packet
	 * @param {U8} [data.requestImage.type] Type
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default RequestImage

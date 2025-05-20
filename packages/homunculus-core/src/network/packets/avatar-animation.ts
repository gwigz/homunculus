import * as Types from "../types"
import Packet from "./packet"

/**
 * AvatarAnimation Packet
 */
class AvatarAnimation extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 20

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
			"sender",
			{
				quantity: 1,
				parameters: new Map<string, any>([["id", Types.UUID]]),
			},
		],
		[
			"animationList",
			{
				parameters: new Map<string, any>([
					["anim", Types.UUID],
					["animSequence", Types.S32],
				]),
			},
		],
		[
			"animationSourceList",
			{ parameters: new Map<string, any>([["object", Types.UUID]]) },
		],
		[
			"physicalAvatarEventList",
			{
				parameters: new Map<string, any>([["typeData", Types.Variable1]]),
			},
		],
	])

	/**
	 * AvatarAnimation constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link AvatarAnimation.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.sender.id] ID
	 * @param {string} [data.animationList.anim] AnimID
	 * @param {S32} [data.animationList.animSequence] AnimSequenceID
	 * @param {string} [data.animationSourceList.object] ObjectID
	 * @param {Variable1} [data.physicalAvatarEventList.typeData] TypeData
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default AvatarAnimation

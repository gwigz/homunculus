import * as Types from "../types"
import Packet from "./packet"

/**
 * PickInfoReply Packet
 */
class PickInfoReply extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static override id = 184

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
	public static override trusted = true

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
				parameters: new Map<string, any>([["agent", Types.UUID]]),
			},
		],
		[
			"data",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["pick", Types.UUID],
					["creator", Types.UUID],
					["topPick", Types.Boolean],
					["parcel", Types.UUID],
					["name", Types.Variable1],
					["desc", Types.Variable2],
					["snapshot", Types.UUID],
					["user", Types.Variable1],
					["originalName", Types.Variable1],
					["simName", Types.Variable1],
					["posGlobal", Types.Vector3D],
					["sortOrder", Types.S32],
					["enabled", Types.Boolean],
				]),
			},
		],
	])

	/**
	 * PickInfoReply constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link PickInfoReply.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.data.pick] PickID
	 * @param {string} [data.data.creator] CreatorID
	 * @param {boolean} [data.data.topPick] TopPick
	 * @param {string} [data.data.parcel] ParcelID
	 * @param {Variable1} [data.data.name] Name
	 * @param {Variable2} [data.data.desc] Desc
	 * @param {string} [data.data.snapshot] SnapshotID
	 * @param {Variable1} [data.data.user] User
	 * @param {Variable1} [data.data.originalName] OriginalName
	 * @param {Variable1} [data.data.simName] SimName
	 * @param {Vector3D} [data.data.posGlobal] PosGlobal
	 * @param {S32} [data.data.sortOrder] SortOrder
	 * @param {boolean} [data.data.enabled] Enabled
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default PickInfoReply

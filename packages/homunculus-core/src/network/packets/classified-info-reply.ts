import * as Types from "../types"
import Packet from "./packet"

/**
 * ClassifiedInfoReply Packet
 */
class ClassifiedInfoReply extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 44

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
				parameters: new Map<string, any>([["agent", Types.UUID]]),
			},
		],
		[
			"data",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["classified", Types.UUID],
					["creator", Types.UUID],
					["creationDate", Types.U32],
					["expirationDate", Types.U32],
					["category", Types.U32],
					["name", Types.Variable1],
					["desc", Types.Variable2],
					["parcel", Types.UUID],
					["parentEstate", Types.U32],
					["snapshot", Types.UUID],
					["simName", Types.Variable1],
					["posGlobal", Types.Vector3D],
					["parcelName", Types.Variable1],
					["classifiedFlags", Types.U8],
					["priceForListing", Types.S32],
				]),
			},
		],
	])

	/**
	 * ClassifiedInfoReply constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ClassifiedInfoReply.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.data.classified] ClassifiedID
	 * @param {string} [data.data.creator] CreatorID
	 * @param {U32} [data.data.creationDate] CreationDate
	 * @param {U32} [data.data.expirationDate] ExpirationDate
	 * @param {U32} [data.data.category] Category
	 * @param {Variable1} [data.data.name] Name
	 * @param {Variable2} [data.data.desc] Desc
	 * @param {string} [data.data.parcel] ParcelID
	 * @param {U32} [data.data.parentEstate] ParentEstate
	 * @param {string} [data.data.snapshot] SnapshotID
	 * @param {Variable1} [data.data.simName] SimName
	 * @param {Vector3D} [data.data.posGlobal] PosGlobal
	 * @param {Variable1} [data.data.parcelName] ParcelName
	 * @param {U8} [data.data.classifiedFlags] ClassifiedFlags
	 * @param {S32} [data.data.priceForListing] PriceForListing
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ClassifiedInfoReply

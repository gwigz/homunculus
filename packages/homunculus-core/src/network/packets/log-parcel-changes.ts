import * as Types from "../types"
import Packet from "./packet"

/**
 * LogParcelChanges Packet
 */
class LogParcelChanges extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static override id = 224

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
	public static override compression = true

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
			"regionData",
			{
				quantity: 1,
				parameters: new Map<string, any>([["regionHandle", Types.U64]]),
			},
		],
		[
			"parcelData",
			{
				parameters: new Map<string, any>([
					["parcel", Types.UUID],
					["owner", Types.UUID],
					["isOwnerGroup", Types.Boolean],
					["actualArea", Types.S32],
					["action", Types.S8],
					["transaction", Types.UUID],
				]),
			},
		],
	])

	/**
	 * LogParcelChanges constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link LogParcelChanges.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {U64} [data.regionData.regionHandle] RegionHandle
	 * @param {string} [data.parcelData.parcel] ParcelID
	 * @param {string} [data.parcelData.owner] OwnerID
	 * @param {boolean} [data.parcelData.isOwnerGroup] IsOwnerGroup
	 * @param {S32} [data.parcelData.actualArea] ActualArea
	 * @param {S8} [data.parcelData.action] Action
	 * @param {string} [data.parcelData.transaction] TransactionID
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default LogParcelChanges

import { Collection } from "../../utilities"
import Packet from "./packet"

import * as Types from "../types"

/**
 * ParcelInfoReply Packet
 */
class ParcelInfoReply extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 *
	 * @type {number}
	 */
	public static id = 55

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
	public static compression = true

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
			"data",
			{
				quantity: 1,
				parameters: new Collection<string, any>([
					["parcel", Types.UUID],
					["owner", Types.UUID],
					["name", Types.Variable1],
					["desc", Types.Variable1],
					["actualArea", Types.S32],
					["billableArea", Types.S32],
					["flags", Types.U8],
					["globalX", Types.F32],
					["globalY", Types.F32],
					["globalZ", Types.F32],
					["simName", Types.Variable1],
					["snapshot", Types.UUID],
					["dwell", Types.F32],
					["salePrice", Types.S32],
					["auction", Types.S32],
				]),
			},
		],
	])

	/**
	 * ParcelInfoReply constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ParcelInfoReply.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.data.parcel] ParcelID
	 * @param {string} [data.data.owner] OwnerID
	 * @param {Variable1} [data.data.name] Name
	 * @param {Variable1} [data.data.desc] Desc
	 * @param {S32} [data.data.actualArea] ActualArea
	 * @param {S32} [data.data.billableArea] BillableArea
	 * @param {U8} [data.data.flags] Flags
	 * @param {F32} [data.data.globalX] GlobalX
	 * @param {F32} [data.data.globalY] GlobalY
	 * @param {F32} [data.data.globalZ] GlobalZ
	 * @param {Variable1} [data.data.simName] SimName
	 * @param {string} [data.data.snapshot] SnapshotID
	 * @param {F32} [data.data.dwell] Dwell
	 * @param {S32} [data.data.salePrice] SalePrice
	 * @param {S32} [data.data.auction] AuctionID
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ParcelInfoReply

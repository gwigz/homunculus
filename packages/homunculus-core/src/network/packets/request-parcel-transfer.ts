import * as Types from "../types"
import Packet from "./packet"

/**
 * RequestParcelTransfer Packet
 */
class RequestParcelTransfer extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 220

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
			"data",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["transaction", Types.UUID],
					["transactionTime", Types.U32],
					["source", Types.UUID],
					["dest", Types.UUID],
					["owner", Types.UUID],
					["flags", Types.U8],
					["transactionType", Types.S32],
					["amount", Types.S32],
					["billableArea", Types.S32],
					["actualArea", Types.S32],
					["final", Types.Boolean],
				]),
			},
		],
		[
			"regionData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["region", Types.UUID],
					["gridX", Types.U32],
					["gridY", Types.U32],
				]),
			},
		],
	])

	/**
	 * RequestParcelTransfer constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link RequestParcelTransfer.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.data.transaction] TransactionID
	 * @param {U32} [data.data.transactionTime] TransactionTime
	 * @param {string} [data.data.source] SourceID
	 * @param {string} [data.data.dest] DestID
	 * @param {string} [data.data.owner] OwnerID
	 * @param {U8} [data.data.flags] Flags
	 * @param {S32} [data.data.transactionType] TransactionType
	 * @param {S32} [data.data.amount] Amount
	 * @param {S32} [data.data.billableArea] BillableArea
	 * @param {S32} [data.data.actualArea] ActualArea
	 * @param {boolean} [data.data.final] Final
	 * @param {string} [data.regionData.region] RegionID
	 * @param {U32} [data.regionData.gridX] GridX
	 * @param {U32} [data.regionData.gridY] GridY
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default RequestParcelTransfer

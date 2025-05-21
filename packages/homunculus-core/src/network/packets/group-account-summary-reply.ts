import * as Types from "../types"
import Packet from "./packet"

/**
 * GroupAccountSummaryReply Packet
 */
class GroupAccountSummaryReply extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 354

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
			"agentData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["agent", Types.UUID],
					["group", Types.UUID],
				]),
			},
		],
		[
			"moneyData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["request", Types.UUID],
					["intervalDays", Types.S32],
					["currentInterval", Types.S32],
					["startDate", Types.Variable1],
					["balance", Types.S32],
					["totalCredits", Types.S32],
					["totalDebits", Types.S32],
					["objectTaxCurrent", Types.S32],
					["lightTaxCurrent", Types.S32],
					["landTaxCurrent", Types.S32],
					["groupTaxCurrent", Types.S32],
					["parcelDirFeeCurrent", Types.S32],
					["objectTaxEstimate", Types.S32],
					["lightTaxEstimate", Types.S32],
					["landTaxEstimate", Types.S32],
					["groupTaxEstimate", Types.S32],
					["parcelDirFeeEstimate", Types.S32],
					["nonExemptMembers", Types.S32],
					["lastTaxDate", Types.Variable1],
					["taxDate", Types.Variable1],
				]),
			},
		],
	])

	/**
	 * GroupAccountSummaryReply constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link GroupAccountSummaryReply.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.group] GroupID
	 * @param {string} [data.moneyData.request] RequestID
	 * @param {S32} [data.moneyData.intervalDays] IntervalDays
	 * @param {S32} [data.moneyData.currentInterval] CurrentInterval
	 * @param {Variable1} [data.moneyData.startDate] StartDate
	 * @param {S32} [data.moneyData.balance] Balance
	 * @param {S32} [data.moneyData.totalCredits] TotalCredits
	 * @param {S32} [data.moneyData.totalDebits] TotalDebits
	 * @param {S32} [data.moneyData.objectTaxCurrent] ObjectTaxCurrent
	 * @param {S32} [data.moneyData.lightTaxCurrent] LightTaxCurrent
	 * @param {S32} [data.moneyData.landTaxCurrent] LandTaxCurrent
	 * @param {S32} [data.moneyData.groupTaxCurrent] GroupTaxCurrent
	 * @param {S32} [data.moneyData.parcelDirFeeCurrent] ParcelDirFeeCurrent
	 * @param {S32} [data.moneyData.objectTaxEstimate] ObjectTaxEstimate
	 * @param {S32} [data.moneyData.lightTaxEstimate] LightTaxEstimate
	 * @param {S32} [data.moneyData.landTaxEstimate] LandTaxEstimate
	 * @param {S32} [data.moneyData.groupTaxEstimate] GroupTaxEstimate
	 * @param {S32} [data.moneyData.parcelDirFeeEstimate] ParcelDirFeeEstimate
	 * @param {S32} [data.moneyData.nonExemptMembers] NonExemptMembers
	 * @param {Variable1} [data.moneyData.lastTaxDate] LastTaxDate
	 * @param {Variable1} [data.moneyData.taxDate] TaxDate
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default GroupAccountSummaryReply

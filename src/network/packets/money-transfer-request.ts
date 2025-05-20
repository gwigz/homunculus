import Packet from "./packet"

import * as Types from "../types"

/**
 * MoneyTransferRequest Packet
 */
class MoneyTransferRequest extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 311

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
	public static trusted = false

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
					["session", Types.UUID],
				]),
			},
		],
		[
			"moneyData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["source", Types.UUID],
					["dest", Types.UUID],
					["flags", Types.U8],
					["amount", Types.S32],
					["aggregatePermNextOwner", Types.U8],
					["aggregatePermInventory", Types.U8],
					["transactionType", Types.S32],
					["description", Types.Variable1],
				]),
			},
		],
	])

	/**
	 * MoneyTransferRequest constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link MoneyTransferRequest.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {string} [data.moneyData.source] SourceID
	 * @param {string} [data.moneyData.dest] DestID
	 * @param {U8} [data.moneyData.flags] Flags
	 * @param {S32} [data.moneyData.amount] Amount
	 * @param {U8} [data.moneyData.aggregatePermNextOwner] AggregatePermNextOwner
	 * @param {U8} [data.moneyData.aggregatePermInventory] AggregatePermInventory
	 * @param {S32} [data.moneyData.transactionType] TransactionType
	 * @param {Variable1} [data.moneyData.description] Description
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default MoneyTransferRequest

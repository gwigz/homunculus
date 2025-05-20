import { Collection } from "../../utilities"
import Packet from "./packet"

import * as Types from "../types"

/**
 * GroupAccountTransactionsReply Packet
 */
class GroupAccountTransactionsReply extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 *
	 * @type {number}
	 */
	public static id = 358

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
				parameters: new Collection<string, any>([
					["agent", Types.UUID],
					["group", Types.UUID],
				]),
			},
		],
		// tslint:disable-next-line:max-line-length
		[
			"moneyData",
			{
				quantity: 1,
				parameters: new Collection<string, any>([
					["request", Types.UUID],
					["intervalDays", Types.S32],
					["currentInterval", Types.S32],
					["startDate", Types.Variable1],
				]),
			},
		],
		// tslint:disable-next-line:max-line-length
		[
			"historyData",
			{
				parameters: new Collection<string, any>([
					["time", Types.Variable1],
					["user", Types.Variable1],
					["type", Types.S32],
					["item", Types.Variable1],
					["amount", Types.S32],
				]),
			},
		],
	])

	/**
	 * GroupAccountTransactionsReply constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link GroupAccountTransactionsReply.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.group] GroupID
	 * @param {string} [data.moneyData.request] RequestID
	 * @param {S32} [data.moneyData.intervalDays] IntervalDays
	 * @param {S32} [data.moneyData.currentInterval] CurrentInterval
	 * @param {Variable1} [data.moneyData.startDate] StartDate
	 * @param {Variable1} [data.historyData.time] Time
	 * @param {Variable1} [data.historyData.user] User
	 * @param {S32} [data.historyData.type] Type
	 * @param {Variable1} [data.historyData.item] Item
	 * @param {S32} [data.historyData.amount] Amount
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default GroupAccountTransactionsReply

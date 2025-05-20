import { Collection } from "../../utilities"
import Packet from "./packet"

import * as Types from "../types"

/**
 * GroupActiveProposalItemReply Packet
 */
class GroupActiveProposalItemReply extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 *
	 * @type {number}
	 */
	public static id = 360

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
			"transactionData",
			{
				quantity: 1,
				parameters: new Collection<string, any>([
					["transaction", Types.UUID],
					["totalNumItems", Types.U32],
				]),
			},
		],
		// tslint:disable-next-line:max-line-length
		[
			"proposalData",
			{
				parameters: new Collection<string, any>([
					["vote", Types.UUID],
					["voteInitiator", Types.UUID],
					["terseDate", Types.Variable1],
					["startDateTime", Types.Variable1],
					["endDateTime", Types.Variable1],
					["alreadyVoted", Types.Boolean],
					["voteCast", Types.Variable1],
					["majority", Types.F32],
					["quorum", Types.S32],
					["proposalText", Types.Variable1],
				]),
			},
		],
	])

	/**
	 * GroupActiveProposalItemReply constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link GroupActiveProposalItemReply.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.group] GroupID
	 * @param {string} [data.transactionData.transaction] TransactionID
	 * @param {U32} [data.transactionData.totalNumItems] TotalNumItems
	 * @param {string} [data.proposalData.vote] VoteID
	 * @param {string} [data.proposalData.voteInitiator] VoteInitiator
	 * @param {Variable1} [data.proposalData.terseDate] TerseDateID
	 * @param {Variable1} [data.proposalData.startDateTime] StartDateTime
	 * @param {Variable1} [data.proposalData.endDateTime] EndDateTime
	 * @param {boolean} [data.proposalData.alreadyVoted] AlreadyVoted
	 * @param {Variable1} [data.proposalData.voteCast] VoteCast
	 * @param {F32} [data.proposalData.majority] Majority
	 * @param {S32} [data.proposalData.quorum] Quorum
	 * @param {Variable1} [data.proposalData.proposalText] ProposalText
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default GroupActiveProposalItemReply

/**
 * GroupActiveProposalItemReply Packet
 *
 * This file is used to help our packet serialization and deserialization
 * process, and to create new packets on the fly.
 *
 * ⚠️ Do not edit this file manually, it is generated by the `codegen` script!
 *
 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
 */

import {
	createPacketDelegate,
	createPacketSender,
	type PacketMetadata,
} from "../packet"
import { Bool, F32, S32, U32, UUID, Variable1 } from "../types"

export interface GroupActiveProposalItemReplyData {
	agentData: {
		agentId?: string
		groupId: string
	}
	transactionData?: {
		transactionId: string
		totalNumItems: number
	}
	proposalData?: {
		voteId: string
		voteInitiator: string
		terseDateId: string | Buffer
		startDateTime: string | Buffer
		endDateTime: string | Buffer
		alreadyVoted: boolean
		voteCast: string | Buffer
		majority: number
		quorum: number
		proposalText: string | Buffer
	}[]
}

export const groupActiveProposalItemReplyMetadata = {
	id: 360,
	name: "GroupActiveProposalItemReply",
	frequency: 2,
	trusted: true,
	compression: true,
	blocks: [
		{
			name: "agentData",
			parameters: [
				["agentId", UUID],
				["groupId", UUID],
			],
		},
		{
			name: "transactionData",
			parameters: [
				["transactionId", UUID],
				["totalNumItems", U32],
			],
		},
		{
			name: "proposalData",
			parameters: [
				["voteId", UUID],
				["voteInitiator", UUID],
				["terseDateId", Variable1],
				["startDateTime", Variable1],
				["endDateTime", Variable1],
				["alreadyVoted", Bool],
				["voteCast", Variable1],
				["majority", F32],
				["quorum", S32],
				["proposalText", Variable1],
			],
			multiple: true,
		},
	],
} satisfies PacketMetadata

export const groupActiveProposalItemReply =
	createPacketSender<GroupActiveProposalItemReplyData>(
		groupActiveProposalItemReplyMetadata,
	)

export const createGroupActiveProposalItemReplyDelegate =
	createPacketDelegate<GroupActiveProposalItemReplyData>(
		groupActiveProposalItemReplyMetadata,
	)

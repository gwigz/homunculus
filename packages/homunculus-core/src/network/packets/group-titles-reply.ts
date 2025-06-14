/**
 * GroupTitlesReply Packet
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
import { Bool, UUID, Variable1 } from "../types"

export interface GroupTitlesReplyData {
	agentData: {
		agentId?: string
		groupId: string
		requestId: string
	}
	groupData?: {
		title: string | Buffer
		roleId: string
		selected: boolean
	}[]
}

export const groupTitlesReplyMetadata = {
	id: 376,
	name: "GroupTitlesReply",
	frequency: 2,
	trusted: true,
	compression: true,
	blocks: [
		{
			name: "agentData",
			parameters: [
				["agentId", UUID],
				["groupId", UUID],
				["requestId", UUID],
			],
		},
		{
			name: "groupData",
			parameters: [
				["title", Variable1],
				["roleId", UUID],
				["selected", Bool],
			],
			multiple: true,
		},
	],
} satisfies PacketMetadata

export const groupTitlesReply = createPacketSender<GroupTitlesReplyData>(
	groupTitlesReplyMetadata,
)

export const createGroupTitlesReplyDelegate =
	createPacketDelegate<GroupTitlesReplyData>(groupTitlesReplyMetadata)

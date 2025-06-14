/**
 * GroupMembersRequest Packet
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
import { UUID } from "../types"

export interface GroupMembersRequestData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
	groupData?: {
		groupId: string
		requestId: string
	}
}

export const groupMembersRequestMetadata = {
	id: 366,
	name: "GroupMembersRequest",
	frequency: 2,
	blocks: [
		{
			name: "agentData",
			parameters: [
				["agentId", UUID],
				["sessionId", UUID],
			],
		},
		{
			name: "groupData",
			parameters: [
				["groupId", UUID],
				["requestId", UUID],
			],
		},
	],
} satisfies PacketMetadata

export const groupMembersRequest = createPacketSender<GroupMembersRequestData>(
	groupMembersRequestMetadata,
)

export const createGroupMembersRequestDelegate =
	createPacketDelegate<GroupMembersRequestData>(groupMembersRequestMetadata)

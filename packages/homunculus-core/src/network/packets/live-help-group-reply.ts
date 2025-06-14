/**
 * LiveHelpGroupReply Packet
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
import { UUID, Variable1 } from "../types"

export interface LiveHelpGroupReplyData {
	replyData?: {
		requestId: string
		groupId: string
		selection: string | Buffer
	}
}

export const liveHelpGroupReplyMetadata = {
	id: 380,
	name: "LiveHelpGroupReply",
	frequency: 2,
	trusted: true,
	blocks: [
		{
			name: "replyData",
			parameters: [
				["requestId", UUID],
				["groupId", UUID],
				["selection", Variable1],
			],
		},
	],
} satisfies PacketMetadata

export const liveHelpGroupReply = createPacketSender<LiveHelpGroupReplyData>(
	liveHelpGroupReplyMetadata,
)

export const createLiveHelpGroupReplyDelegate =
	createPacketDelegate<LiveHelpGroupReplyData>(liveHelpGroupReplyMetadata)

/**
 * EmailMessageReply Packet
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
import { U32, UUID, Variable1, Variable2 } from "../types"

export interface EmailMessageReplyData {
	dataBlock?: {
		objectId: string
		more: number
		time: number
		fromAddress: string | Buffer
		subject: string | Buffer
		data: string | Buffer
		mailFilter: string | Buffer
	}
}

export const emailMessageReplyMetadata = {
	id: 336,
	name: "EmailMessageReply",
	frequency: 2,
	trusted: true,
	blocks: [
		{
			name: "dataBlock",
			parameters: [
				["objectId", UUID],
				["more", U32],
				["time", U32],
				["fromAddress", Variable1],
				["subject", Variable1],
				["data", Variable2],
				["mailFilter", Variable1],
			],
		},
	],
} satisfies PacketMetadata

export const emailMessageReply = createPacketSender<EmailMessageReplyData>(
	emailMessageReplyMetadata,
)

export const createEmailMessageReplyDelegate =
	createPacketDelegate<EmailMessageReplyData>(emailMessageReplyMetadata)

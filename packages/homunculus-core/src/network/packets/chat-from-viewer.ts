/**
 * ChatFromViewer Packet
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
import { S32, U8, UUID, Variable2 } from "../types"

export interface ChatFromViewerData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
	chatData?: {
		message: string | Buffer
		type: number
		channel: number
	}
}

export const chatFromViewerMetadata = {
	id: 80,
	name: "ChatFromViewer",
	frequency: 2,
	compression: true,
	blocks: [
		{
			name: "agentData",
			parameters: [
				["agentId", UUID],
				["sessionId", UUID],
			],
		},
		{
			name: "chatData",
			parameters: [
				["message", Variable2],
				["type", U8],
				["channel", S32],
			],
		},
	],
} satisfies PacketMetadata

export const chatFromViewer = createPacketSender<ChatFromViewerData>(
	chatFromViewerMetadata,
)

export const createChatFromViewerDelegate =
	createPacketDelegate<ChatFromViewerData>(chatFromViewerMetadata)

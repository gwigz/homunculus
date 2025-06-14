/**
 * ScriptRunningReply Packet
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
import { Bool, UUID } from "../types"

export interface ScriptRunningReplyData {
	script?: {
		objectId: string
		itemId: string
		running: boolean
	}
}

export const scriptRunningReplyMetadata = {
	id: 244,
	name: "ScriptRunningReply",
	frequency: 2,
	blocks: [
		{
			name: "script",
			parameters: [
				["objectId", UUID],
				["itemId", UUID],
				["running", Bool],
			],
		},
	],
} satisfies PacketMetadata

export const scriptRunningReply = createPacketSender<ScriptRunningReplyData>(
	scriptRunningReplyMetadata,
)

export const createScriptRunningReplyDelegate =
	createPacketDelegate<ScriptRunningReplyData>(scriptRunningReplyMetadata)

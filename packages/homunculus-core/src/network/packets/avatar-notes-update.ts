/**
 * AvatarNotesUpdate Packet
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
import { UUID, Variable2 } from "../types"

export interface AvatarNotesUpdateData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
	data?: {
		targetId: string
		notes: string | Buffer
	}
}

export const avatarNotesUpdateMetadata = {
	id: 177,
	name: "AvatarNotesUpdate",
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
			name: "data",
			parameters: [
				["targetId", UUID],
				["notes", Variable2],
			],
		},
	],
} satisfies PacketMetadata

export const avatarNotesUpdate = createPacketSender<AvatarNotesUpdateData>(
	avatarNotesUpdateMetadata,
)

export const createAvatarNotesUpdateDelegate =
	createPacketDelegate<AvatarNotesUpdateData>(avatarNotesUpdateMetadata)

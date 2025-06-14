/**
 * FreezeUser Packet
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
import { U32, UUID } from "../types"

export interface FreezeUserData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
	data?: {
		targetId: string
		flags: number
	}
}

export const freezeUserMetadata = {
	id: 168,
	name: "FreezeUser",
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
				["flags", U32],
			],
		},
	],
} satisfies PacketMetadata

export const freezeUser = createPacketSender<FreezeUserData>(freezeUserMetadata)

export const createFreezeUserDelegate =
	createPacketDelegate<FreezeUserData>(freezeUserMetadata)

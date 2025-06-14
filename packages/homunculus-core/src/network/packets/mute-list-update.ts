/**
 * MuteListUpdate Packet
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

export interface MuteListUpdateData {
	muteData?: {
		agentId: string
		filename: string | Buffer
	}
}

export const muteListUpdateMetadata = {
	id: 318,
	name: "MuteListUpdate",
	frequency: 2,
	trusted: true,
	blocks: [
		{
			name: "muteData",
			parameters: [
				["agentId", UUID],
				["filename", Variable1],
			],
		},
	],
} satisfies PacketMetadata

export const muteListUpdate = createPacketSender<MuteListUpdateData>(
	muteListUpdateMetadata,
)

export const createMuteListUpdateDelegate =
	createPacketDelegate<MuteListUpdateData>(muteListUpdateMetadata)

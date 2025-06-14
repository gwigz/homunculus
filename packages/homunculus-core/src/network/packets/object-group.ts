/**
 * ObjectGroup Packet
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

export interface ObjectGroupData {
	agentData: {
		agentId?: string
		sessionId?: string
		groupId: string
	}
	objectData?: {
		objectLocalId: number
	}[]
}

export const objectGroupMetadata = {
	id: 101,
	name: "ObjectGroup",
	frequency: 2,
	compression: true,
	blocks: [
		{
			name: "agentData",
			parameters: [
				["agentId", UUID],
				["sessionId", UUID],
				["groupId", UUID],
			],
		},
		{
			name: "objectData",
			parameters: [["objectLocalId", U32]],
			multiple: true,
		},
	],
} satisfies PacketMetadata

export const objectGroup =
	createPacketSender<ObjectGroupData>(objectGroupMetadata)

export const createObjectGroupDelegate =
	createPacketDelegate<ObjectGroupData>(objectGroupMetadata)

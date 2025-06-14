/**
 * MultipleObjectUpdate Packet
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
import { U8, U32, UUID, Variable1 } from "../types"

export interface MultipleObjectUpdateData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
	objectData?: {
		objectLocalId: number
		type: number
		data: string | Buffer
	}[]
}

export const multipleObjectUpdateMetadata = {
	id: 2,
	name: "MultipleObjectUpdate",
	frequency: 1,
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
			name: "objectData",
			parameters: [
				["objectLocalId", U32],
				["type", U8],
				["data", Variable1],
			],
			multiple: true,
		},
	],
} satisfies PacketMetadata

export const multipleObjectUpdate =
	createPacketSender<MultipleObjectUpdateData>(multipleObjectUpdateMetadata)

export const createMultipleObjectUpdateDelegate =
	createPacketDelegate<MultipleObjectUpdateData>(multipleObjectUpdateMetadata)

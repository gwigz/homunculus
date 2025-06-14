/**
 * LandStatReply Packet
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
import { F32, U32, UUID, Variable1 } from "../types"

export interface LandStatReplyData {
	requestData?: {
		reportType: number
		requestFlags: number
		totalObjectCount: number
	}
	reportData?: {
		taskLocalId: number
		taskId: string
		locationX: number
		locationY: number
		locationZ: number
		score: number
		taskName: string | Buffer
		ownerName: string | Buffer
	}[]
}

export const landStatReplyMetadata = {
	id: 422,
	name: "LandStatReply",
	frequency: 2,
	trusted: true,
	blocks: [
		{
			name: "requestData",
			parameters: [
				["reportType", U32],
				["requestFlags", U32],
				["totalObjectCount", U32],
			],
		},
		{
			name: "reportData",
			parameters: [
				["taskLocalId", U32],
				["taskId", UUID],
				["locationX", F32],
				["locationY", F32],
				["locationZ", F32],
				["score", F32],
				["taskName", Variable1],
				["ownerName", Variable1],
			],
			multiple: true,
		},
	],
} satisfies PacketMetadata

export const landStatReply = createPacketSender<LandStatReplyData>(
	landStatReplyMetadata,
)

export const createLandStatReplyDelegate =
	createPacketDelegate<LandStatReplyData>(landStatReplyMetadata)

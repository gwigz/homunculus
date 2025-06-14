/**
 * PickInfoReply Packet
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
import { Bool, S32, UUID, Variable1, Variable2, Vector3D } from "../types"

export interface PickInfoReplyData {
	agentData?: {
		agentId?: string
	}
	data?: {
		pickId: string
		creatorId: string
		topPick: boolean
		parcelId: string
		name: string | Buffer
		desc: string | Buffer
		snapshotId: string
		user: string | Buffer
		originalName: string | Buffer
		simName: string | Buffer
		posGlobal: Vector3D
		sortOrder: number
		enabled: boolean
	}
}

export const pickInfoReplyMetadata = {
	id: 184,
	name: "PickInfoReply",
	frequency: 2,
	trusted: true,
	blocks: [
		{
			name: "agentData",
			parameters: [["agentId", UUID]],
		},
		{
			name: "data",
			parameters: [
				["pickId", UUID],
				["creatorId", UUID],
				["topPick", Bool],
				["parcelId", UUID],
				["name", Variable1],
				["desc", Variable2],
				["snapshotId", UUID],
				["user", Variable1],
				["originalName", Variable1],
				["simName", Variable1],
				["posGlobal", Vector3D],
				["sortOrder", S32],
				["enabled", Bool],
			],
		},
	],
} satisfies PacketMetadata

export const pickInfoReply = createPacketSender<PickInfoReplyData>(
	pickInfoReplyMetadata,
)

export const createPickInfoReplyDelegate =
	createPacketDelegate<PickInfoReplyData>(pickInfoReplyMetadata)

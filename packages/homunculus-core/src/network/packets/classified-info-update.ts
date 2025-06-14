/**
 * ClassifiedInfoUpdate Packet
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
import { S32, U8, U32, UUID, Variable1, Variable2, Vector3D } from "../types"

export interface ClassifiedInfoUpdateData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
	data?: {
		classifiedId: string
		category: number
		name: string | Buffer
		desc: string | Buffer
		parcelId: string
		parentEstate: number
		snapshotId: string
		posGlobal: Vector3D
		classifiedFlags: number
		priceForListing: number
	}
}

export const classifiedInfoUpdateMetadata = {
	id: 45,
	name: "ClassifiedInfoUpdate",
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
				["classifiedId", UUID],
				["category", U32],
				["name", Variable1],
				["desc", Variable2],
				["parcelId", UUID],
				["parentEstate", U32],
				["snapshotId", UUID],
				["posGlobal", Vector3D],
				["classifiedFlags", U8],
				["priceForListing", S32],
			],
		},
	],
} satisfies PacketMetadata

export const classifiedInfoUpdate =
	createPacketSender<ClassifiedInfoUpdateData>(classifiedInfoUpdateMetadata)

export const createClassifiedInfoUpdateDelegate =
	createPacketDelegate<ClassifiedInfoUpdateData>(classifiedInfoUpdateMetadata)

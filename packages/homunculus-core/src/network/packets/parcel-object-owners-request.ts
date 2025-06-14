/**
 * ParcelObjectOwnersRequest Packet
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
import { S32, UUID } from "../types"

export interface ParcelObjectOwnersRequestData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
	parcelData?: {
		localId: number
	}
}

export const parcelObjectOwnersRequestMetadata = {
	id: 56,
	name: "ParcelObjectOwnersRequest",
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
			name: "parcelData",
			parameters: [["localId", S32]],
		},
	],
} satisfies PacketMetadata

export const parcelObjectOwnersRequest =
	createPacketSender<ParcelObjectOwnersRequestData>(
		parcelObjectOwnersRequestMetadata,
	)

export const createParcelObjectOwnersRequestDelegate =
	createPacketDelegate<ParcelObjectOwnersRequestData>(
		parcelObjectOwnersRequestMetadata,
	)

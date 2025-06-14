/**
 * RequestObjectPropertiesFamily Packet
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

export interface RequestObjectPropertiesFamilyData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
	objectData?: {
		requestFlags: number
		objectId: string
	}
}

export const requestObjectPropertiesFamilyMetadata = {
	id: 5,
	name: "RequestObjectPropertiesFamily",
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
				["requestFlags", U32],
				["objectId", UUID],
			],
		},
	],
} satisfies PacketMetadata

export const requestObjectPropertiesFamily =
	createPacketSender<RequestObjectPropertiesFamilyData>(
		requestObjectPropertiesFamilyMetadata,
	)

export const createRequestObjectPropertiesFamilyDelegate =
	createPacketDelegate<RequestObjectPropertiesFamilyData>(
		requestObjectPropertiesFamilyMetadata,
	)

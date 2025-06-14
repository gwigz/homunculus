/**
 * CreateLandmarkForEvent Packet
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
import { U32, UUID, Variable1 } from "../types"

export interface CreateLandmarkForEventData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
	eventData?: {
		eventId: number
	}
	inventoryBlock?: {
		folderId: string
		name: string | Buffer
	}
}

export const createLandmarkForEventMetadata = {
	id: 306,
	name: "CreateLandmarkForEvent",
	frequency: 2,
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
			name: "eventData",
			parameters: [["eventId", U32]],
		},
		{
			name: "inventoryBlock",
			parameters: [
				["folderId", UUID],
				["name", Variable1],
			],
		},
	],
} satisfies PacketMetadata

export const createLandmarkForEvent =
	createPacketSender<CreateLandmarkForEventData>(createLandmarkForEventMetadata)

export const createCreateLandmarkForEventDelegate =
	createPacketDelegate<CreateLandmarkForEventData>(
		createLandmarkForEventMetadata,
	)

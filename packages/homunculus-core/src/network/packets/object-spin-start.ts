/**
 * ObjectSpinStart Packet
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
import { UUID } from "../types"

export interface ObjectSpinStartData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
	objectData?: {
		objectId: string
	}
}

export const objectSpinStartMetadata = {
	id: 120,
	name: "ObjectSpinStart",
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
			name: "objectData",
			parameters: [["objectId", UUID]],
		},
	],
} satisfies PacketMetadata

export const objectSpinStart = createPacketSender<ObjectSpinStartData>(
	objectSpinStartMetadata,
)

export const createObjectSpinStartDelegate =
	createPacketDelegate<ObjectSpinStartData>(objectSpinStartMetadata)

/**
 * EventInfoRequest Packet
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

export interface EventInfoRequestData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
	eventData?: {
		eventId: number
	}
}

export const eventInfoRequestMetadata = {
	id: 179,
	name: "EventInfoRequest",
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
			name: "eventData",
			parameters: [["eventId", U32]],
		},
	],
} satisfies PacketMetadata

export const eventInfoRequest = createPacketSender<EventInfoRequestData>(
	eventInfoRequestMetadata,
)

export const createEventInfoRequestDelegate =
	createPacketDelegate<EventInfoRequestData>(eventInfoRequestMetadata)

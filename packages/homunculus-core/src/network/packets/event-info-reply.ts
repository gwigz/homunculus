/**
 * EventInfoReply Packet
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
import { U32, UUID, Variable1, Variable2, Vector3D } from "../types"

export interface EventInfoReplyData {
	agentData?: {
		agentId?: string
	}
	eventData?: {
		eventId: number
		creator: string | Buffer
		name: string | Buffer
		category: string | Buffer
		desc: string | Buffer
		date: string | Buffer
		dateUtc: number
		duration: number
		cover: number
		amount: number
		simName: string | Buffer
		globalPos: Vector3D
		eventFlags: number
	}
}

export const eventInfoReplyMetadata = {
	id: 180,
	name: "EventInfoReply",
	frequency: 2,
	trusted: true,
	blocks: [
		{
			name: "agentData",
			parameters: [["agentId", UUID]],
		},
		{
			name: "eventData",
			parameters: [
				["eventId", U32],
				["creator", Variable1],
				["name", Variable1],
				["category", Variable1],
				["desc", Variable2],
				["date", Variable1],
				["dateUtc", U32],
				["duration", U32],
				["cover", U32],
				["amount", U32],
				["simName", Variable1],
				["globalPos", Vector3D],
				["eventFlags", U32],
			],
		},
	],
} satisfies PacketMetadata

export const eventInfoReply = createPacketSender<EventInfoReplyData>(
	eventInfoReplyMetadata,
)

export const createEventInfoReplyDelegate =
	createPacketDelegate<EventInfoReplyData>(eventInfoReplyMetadata)

/**
 * AgentRequestSit Packet
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
import { UUID, Vector3 } from "../types"

export interface AgentRequestSitData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
	targetObject?: {
		targetId: string
		offset: Vector3
	}
}

export const agentRequestSitMetadata = {
	id: 6,
	name: "AgentRequestSit",
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
			name: "targetObject",
			parameters: [
				["targetId", UUID],
				["offset", Vector3],
			],
		},
	],
} satisfies PacketMetadata

export const agentRequestSit = createPacketSender<AgentRequestSitData>(
	agentRequestSitMetadata,
)

export const createAgentRequestSitDelegate =
	createPacketDelegate<AgentRequestSitData>(agentRequestSitMetadata)

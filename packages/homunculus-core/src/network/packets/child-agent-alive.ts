/**
 * ChildAgentAlive Packet
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
import { U32, U64, UUID } from "../types"

export interface ChildAgentAliveData {
	agentData: {
		regionHandle: number | bigint
		viewerCircuitCode: number
		agentId?: string
		sessionId?: string
	}
}

export const childAgentAliveMetadata = {
	id: 26,
	name: "ChildAgentAlive",
	trusted: true,
	blocks: [
		{
			name: "agentData",
			parameters: [
				["regionHandle", U64],
				["viewerCircuitCode", U32],
				["agentId", UUID],
				["sessionId", UUID],
			],
		},
	],
} satisfies PacketMetadata

export const childAgentAlive = createPacketSender<ChildAgentAliveData>(
	childAgentAliveMetadata,
)

export const createChildAgentAliveDelegate =
	createPacketDelegate<ChildAgentAliveData>(childAgentAliveMetadata)

/**
 * AgentHeightWidth Packet
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
import { U16, U32, UUID } from "../types"

export interface AgentHeightWidthData {
	agentData?: {
		agentId?: string
		sessionId?: string
		circuitCode?: number
	}
	heightWidthBlock?: {
		genCounter: number
		height: number
		width: number
	}
}

export const agentHeightWidthMetadata = {
	id: 83,
	name: "AgentHeightWidth",
	frequency: 2,
	blocks: [
		{
			name: "agentData",
			parameters: [
				["agentId", UUID],
				["sessionId", UUID],
				["circuitCode", U32],
			],
		},
		{
			name: "heightWidthBlock",
			parameters: [
				["genCounter", U32],
				["height", U16],
				["width", U16],
			],
		},
	],
} satisfies PacketMetadata

export const agentHeightWidth = createPacketSender<AgentHeightWidthData>(
	agentHeightWidthMetadata,
)

export const createAgentHeightWidthDelegate =
	createPacketDelegate<AgentHeightWidthData>(agentHeightWidthMetadata)

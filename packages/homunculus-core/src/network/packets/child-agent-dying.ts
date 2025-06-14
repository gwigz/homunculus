/**
 * ChildAgentDying Packet
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

export interface ChildAgentDyingData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
}

export const childAgentDyingMetadata = {
	id: 240,
	name: "ChildAgentDying",
	frequency: 2,
	trusted: true,
	compression: true,
	blocks: [
		{
			name: "agentData",
			parameters: [
				["agentId", UUID],
				["sessionId", UUID],
			],
		},
	],
} satisfies PacketMetadata

export const childAgentDying = createPacketSender<ChildAgentDyingData>(
	childAgentDyingMetadata,
)

export const createChildAgentDyingDelegate =
	createPacketDelegate<ChildAgentDyingData>(childAgentDyingMetadata)

/**
 * AgentGroupDataUpdate Packet
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
import { Bool, S32, U64, UUID, Variable1 } from "../types"

export interface AgentGroupDataUpdateData {
	agentData?: {
		agentId?: string
	}
	groupData?: {
		groupId: string
		groupPowers: number | bigint
		acceptNotices: boolean
		groupInsigniaId: string
		contribution: number
		groupName: string | Buffer
	}[]
}

export const agentGroupDataUpdateMetadata = {
	id: 389,
	name: "AgentGroupDataUpdate",
	frequency: 2,
	trusted: true,
	compression: true,
	blocks: [
		{
			name: "agentData",
			parameters: [["agentId", UUID]],
		},
		{
			name: "groupData",
			parameters: [
				["groupId", UUID],
				["groupPowers", U64],
				["acceptNotices", Bool],
				["groupInsigniaId", UUID],
				["contribution", S32],
				["groupName", Variable1],
			],
			multiple: true,
		},
	],
} satisfies PacketMetadata

export const agentGroupDataUpdate =
	createPacketSender<AgentGroupDataUpdateData>(agentGroupDataUpdateMetadata)

export const createAgentGroupDataUpdateDelegate =
	createPacketDelegate<AgentGroupDataUpdateData>(agentGroupDataUpdateMetadata)

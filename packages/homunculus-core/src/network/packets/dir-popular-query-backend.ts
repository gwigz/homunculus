/**
 * DirPopularQueryBackend Packet
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
import { Bool, U32, UUID } from "../types"

export interface DirPopularQueryBackendData {
	agentData?: {
		agentId?: string
	}
	queryData?: {
		queryId: string
		queryFlags: number
		estateId: number
		godlike: boolean
	}
}

export const dirPopularQueryBackendMetadata = {
	id: 52,
	name: "DirPopularQueryBackend",
	frequency: 2,
	trusted: true,
	compression: true,
	blocks: [
		{
			name: "agentData",
			parameters: [["agentId", UUID]],
		},
		{
			name: "queryData",
			parameters: [
				["queryId", UUID],
				["queryFlags", U32],
				["estateId", U32],
				["godlike", Bool],
			],
		},
	],
} satisfies PacketMetadata

export const dirPopularQueryBackend =
	createPacketSender<DirPopularQueryBackendData>(dirPopularQueryBackendMetadata)

export const createDirPopularQueryBackendDelegate =
	createPacketDelegate<DirPopularQueryBackendData>(
		dirPopularQueryBackendMetadata,
	)

/**
 * DirFindQuery Packet
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
import { S32, U32, UUID, Variable1 } from "../types"

export interface DirFindQueryData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
	queryData?: {
		queryId: string
		queryText: string | Buffer
		queryFlags: number
		queryStart: number
	}
}

export const dirFindQueryMetadata = {
	id: 31,
	name: "DirFindQuery",
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
			name: "queryData",
			parameters: [
				["queryId", UUID],
				["queryText", Variable1],
				["queryFlags", U32],
				["queryStart", S32],
			],
		},
	],
} satisfies PacketMetadata

export const dirFindQuery =
	createPacketSender<DirFindQueryData>(dirFindQueryMetadata)

export const createDirFindQueryDelegate =
	createPacketDelegate<DirFindQueryData>(dirFindQueryMetadata)

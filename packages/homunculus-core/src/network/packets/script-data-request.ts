/**
 * ScriptDataRequest Packet
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
import { S8, U64, Variable2 } from "../types"

export interface ScriptDataRequestData {
	dataBlock?: {
		hash: number | bigint
		requestType: number
		request: string | Buffer
	}[]
}

export const scriptDataRequestMetadata = {
	id: 337,
	name: "ScriptDataRequest",
	frequency: 2,
	trusted: true,
	blocks: [
		{
			name: "dataBlock",
			parameters: [
				["hash", U64],
				["requestType", S8],
				["request", Variable2],
			],
			multiple: true,
		},
	],
} satisfies PacketMetadata

export const scriptDataRequest = createPacketSender<ScriptDataRequestData>(
	scriptDataRequestMetadata,
)

export const createScriptDataRequestDelegate =
	createPacketDelegate<ScriptDataRequestData>(scriptDataRequestMetadata)

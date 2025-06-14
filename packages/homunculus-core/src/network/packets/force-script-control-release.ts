/**
 * ForceScriptControlRelease Packet
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

export interface ForceScriptControlReleaseData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
}

export const forceScriptControlReleaseMetadata = {
	id: 192,
	name: "ForceScriptControlRelease",
	frequency: 2,
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

export const forceScriptControlRelease =
	createPacketSender<ForceScriptControlReleaseData>(
		forceScriptControlReleaseMetadata,
	)

export const createForceScriptControlReleaseDelegate =
	createPacketDelegate<ForceScriptControlReleaseData>(
		forceScriptControlReleaseMetadata,
	)

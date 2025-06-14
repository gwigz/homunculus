/**
 * ScriptTeleportRequest Packet
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
import { Variable1, Vector3 } from "../types"

export interface ScriptTeleportRequestData {
	data?: {
		objectName: string | Buffer
		simName: string | Buffer
		simPosition: Vector3
		lookAt: Vector3
	}
}

export const scriptTeleportRequestMetadata = {
	id: 195,
	name: "ScriptTeleportRequest",
	frequency: 2,
	trusted: true,
	blocks: [
		{
			name: "data",
			parameters: [
				["objectName", Variable1],
				["simName", Variable1],
				["simPosition", Vector3],
				["lookAt", Vector3],
			],
		},
	],
} satisfies PacketMetadata

export const scriptTeleportRequest =
	createPacketSender<ScriptTeleportRequestData>(scriptTeleportRequestMetadata)

export const createScriptTeleportRequestDelegate =
	createPacketDelegate<ScriptTeleportRequestData>(scriptTeleportRequestMetadata)

/**
 * HealthMessage Packet
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
import { F32 } from "../types"

export interface HealthMessageData {
	healthData?: {
		health: number
	}
}

export const healthMessageMetadata = {
	id: 138,
	name: "HealthMessage",
	frequency: 2,
	trusted: true,
	compression: true,
	blocks: [
		{
			name: "healthData",
			parameters: [["health", F32]],
		},
	],
} satisfies PacketMetadata

export const healthMessage = createPacketSender<HealthMessageData>(
	healthMessageMetadata,
)

export const createHealthMessageDelegate =
	createPacketDelegate<HealthMessageData>(healthMessageMetadata)

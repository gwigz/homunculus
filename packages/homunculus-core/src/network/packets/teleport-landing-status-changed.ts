/**
 * TeleportLandingStatusChanged Packet
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
import { U64 } from "../types"

export interface TeleportLandingStatusChangedData {
	regionData?: {
		regionHandle: number | bigint
	}
}

export const teleportLandingStatusChangedMetadata = {
	id: 147,
	name: "TeleportLandingStatusChanged",
	frequency: 2,
	trusted: true,
	blocks: [
		{
			name: "regionData",
			parameters: [["regionHandle", U64]],
		},
	],
} satisfies PacketMetadata

export const teleportLandingStatusChanged =
	createPacketSender<TeleportLandingStatusChangedData>(
		teleportLandingStatusChangedMetadata,
	)

export const createTeleportLandingStatusChangedDelegate =
	createPacketDelegate<TeleportLandingStatusChangedData>(
		teleportLandingStatusChangedMetadata,
	)

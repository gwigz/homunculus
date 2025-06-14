/**
 * SimulatorMapUpdate Packet
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
import { U32 } from "../types"

export interface SimulatorMapUpdateData {
	mapData?: {
		flags: number
	}
}

export const simulatorMapUpdateMetadata = {
	id: 5,
	name: "SimulatorMapUpdate",
	frequency: 2,
	trusted: true,
	blocks: [
		{
			name: "mapData",
			parameters: [["flags", U32]],
		},
	],
} satisfies PacketMetadata

export const simulatorMapUpdate = createPacketSender<SimulatorMapUpdateData>(
	simulatorMapUpdateMetadata,
)

export const createSimulatorMapUpdateDelegate =
	createPacketDelegate<SimulatorMapUpdateData>(simulatorMapUpdateMetadata)

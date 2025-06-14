/**
 * UpdateSimulator Packet
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
import { U8, U32, UUID, Variable1 } from "../types"

export interface UpdateSimulatorData {
	simulatorInfo?: {
		regionId: string
		simName: string | Buffer
		estateId: number
		simAccess: number
	}
}

export const updateSimulatorMetadata = {
	id: 17,
	name: "UpdateSimulator",
	frequency: 2,
	trusted: true,
	blocks: [
		{
			name: "simulatorInfo",
			parameters: [
				["regionId", UUID],
				["simName", Variable1],
				["estateId", U32],
				["simAccess", U8],
			],
		},
	],
} satisfies PacketMetadata

export const updateSimulator = createPacketSender<UpdateSimulatorData>(
	updateSimulatorMetadata,
)

export const createUpdateSimulatorDelegate =
	createPacketDelegate<UpdateSimulatorData>(updateSimulatorMetadata)

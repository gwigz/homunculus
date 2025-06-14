/**
 * ConfirmEnableSimulator Packet
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

export interface ConfirmEnableSimulatorData {
	agentData?: {
		agentId?: string
		sessionId?: string
	}
}

export const confirmEnableSimulatorMetadata = {
	id: 8,
	name: "ConfirmEnableSimulator",
	frequency: 1,
	trusted: true,
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

export const confirmEnableSimulator =
	createPacketSender<ConfirmEnableSimulatorData>(confirmEnableSimulatorMetadata)

export const createConfirmEnableSimulatorDelegate =
	createPacketDelegate<ConfirmEnableSimulatorData>(
		confirmEnableSimulatorMetadata,
	)

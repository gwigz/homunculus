/**
 * DenyTrustedCircuit Packet
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

export interface DenyTrustedCircuitData {
	dataBlock?: {
		endPointId: string
	}
}

export const denyTrustedCircuitMetadata = {
	id: 393,
	name: "DenyTrustedCircuit",
	frequency: 2,
	blocks: [
		{
			name: "dataBlock",
			parameters: [["endPointId", UUID]],
		},
	],
} satisfies PacketMetadata

export const denyTrustedCircuit = createPacketSender<DenyTrustedCircuitData>(
	denyTrustedCircuitMetadata,
)

export const createDenyTrustedCircuitDelegate =
	createPacketDelegate<DenyTrustedCircuitData>(denyTrustedCircuitMetadata)

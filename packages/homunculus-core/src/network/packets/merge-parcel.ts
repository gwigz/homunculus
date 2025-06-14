/**
 * MergeParcel Packet
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

export interface MergeParcelData {
	masterParcelData?: {
		masterId: string
	}
	slaveParcelData?: {
		slaveId: string
	}[]
}

export const mergeParcelMetadata = {
	id: 223,
	name: "MergeParcel",
	frequency: 2,
	trusted: true,
	blocks: [
		{
			name: "masterParcelData",
			parameters: [["masterId", UUID]],
		},
		{
			name: "slaveParcelData",
			parameters: [["slaveId", UUID]],
			multiple: true,
		},
	],
} satisfies PacketMetadata

export const mergeParcel =
	createPacketSender<MergeParcelData>(mergeParcelMetadata)

export const createMergeParcelDelegate =
	createPacketDelegate<MergeParcelData>(mergeParcelMetadata)

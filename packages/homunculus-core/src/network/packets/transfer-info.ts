/**
 * TransferInfo Packet
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
import { S32, UUID, Variable2 } from "../types"

export interface TransferInfoData {
	transferInfo?: {
		transferId: string
		channelType: number
		targetType: number
		status: number
		size: number
		params: string | Buffer
	}
}

export const transferInfoMetadata = {
	id: 154,
	name: "TransferInfo",
	frequency: 2,
	compression: true,
	blocks: [
		{
			name: "transferInfo",
			parameters: [
				["transferId", UUID],
				["channelType", S32],
				["targetType", S32],
				["status", S32],
				["size", S32],
				["params", Variable2],
			],
		},
	],
} satisfies PacketMetadata

export const transferInfo =
	createPacketSender<TransferInfoData>(transferInfoMetadata)

export const createTransferInfoDelegate =
	createPacketDelegate<TransferInfoData>(transferInfoMetadata)

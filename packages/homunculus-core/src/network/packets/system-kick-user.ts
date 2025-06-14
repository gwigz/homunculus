/**
 * SystemKickUser Packet
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

export interface SystemKickUserData {
	agentInfo?: {
		agentId: string
	}[]
}

export const systemKickUserMetadata = {
	id: 166,
	name: "SystemKickUser",
	frequency: 2,
	trusted: true,
	blocks: [
		{
			name: "agentInfo",
			parameters: [["agentId", UUID]],
			multiple: true,
		},
	],
} satisfies PacketMetadata

export const systemKickUser = createPacketSender<SystemKickUserData>(
	systemKickUserMetadata,
)

export const createSystemKickUserDelegate =
	createPacketDelegate<SystemKickUserData>(systemKickUserMetadata)

/**
 * AttachedSound Packet
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
import { F32, U8, UUID } from "../types"

export interface AttachedSoundData {
	dataBlock?: {
		soundId: string
		objectId: string
		ownerId: string
		gain: number
		flags: number
	}
}

export const attachedSoundMetadata = {
	id: 13,
	name: "AttachedSound",
	frequency: 1,
	trusted: true,
	blocks: [
		{
			name: "dataBlock",
			parameters: [
				["soundId", UUID],
				["objectId", UUID],
				["ownerId", UUID],
				["gain", F32],
				["flags", U8],
			],
		},
	],
} satisfies PacketMetadata

export const attachedSound = createPacketSender<AttachedSoundData>(
	attachedSoundMetadata,
)

export const createAttachedSoundDelegate =
	createPacketDelegate<AttachedSoundData>(attachedSoundMetadata)

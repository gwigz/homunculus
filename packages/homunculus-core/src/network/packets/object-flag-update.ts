/**
 * ObjectFlagUpdate Packet
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
import { Bool, F32, U8, U32, UUID } from "../types"

export interface ObjectFlagUpdateData {
	agentData: {
		agentId?: string
		sessionId?: string
		objectLocalId: number
		usePhysics: boolean
		isTemporary: boolean
		isPhantom: boolean
		castsShadows: boolean
	}
	extraPhysics?: {
		physicsShapeType: number
		density: number
		friction: number
		restitution: number
		gravityMultiplier: number
	}[]
}

export const objectFlagUpdateMetadata = {
	id: 94,
	name: "ObjectFlagUpdate",
	frequency: 2,
	compression: true,
	blocks: [
		{
			name: "agentData",
			parameters: [
				["agentId", UUID],
				["sessionId", UUID],
				["objectLocalId", U32],
				["usePhysics", Bool],
				["isTemporary", Bool],
				["isPhantom", Bool],
				["castsShadows", Bool],
			],
		},
		{
			name: "extraPhysics",
			parameters: [
				["physicsShapeType", U8],
				["density", F32],
				["friction", F32],
				["restitution", F32],
				["gravityMultiplier", F32],
			],
			multiple: true,
		},
	],
} satisfies PacketMetadata

export const objectFlagUpdate = createPacketSender<ObjectFlagUpdateData>(
	objectFlagUpdateMetadata,
)

export const createObjectFlagUpdateDelegate =
	createPacketDelegate<ObjectFlagUpdateData>(objectFlagUpdateMetadata)

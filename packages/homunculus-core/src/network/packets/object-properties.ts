/**
 * ObjectProperties Packet
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
import { S16, S32, U8, U32, U64, UUID, Variable1 } from "../types"

export interface ObjectPropertiesData {
	objectData?: {
		objectId: string
		creatorId: string
		ownerId: string
		groupId: string
		creationDate: number | bigint
		baseMask: number
		ownerMask: number
		groupMask: number
		everyoneMask: number
		nextOwnerMask: number
		ownershipCost: number
		saleType: number
		salePrice: number
		aggregatePerms: number
		aggregatePermTextures: number
		aggregatePermTexturesOwner: number
		category: number
		inventorySerial: number
		itemId: string
		folderId: string
		fromTaskId: string
		lastOwnerId: string
		name: string | Buffer
		description: string | Buffer
		touchName: string | Buffer
		sitName: string | Buffer
		textureId: string | Buffer
	}[]
}

export const objectPropertiesMetadata = {
	id: 9,
	name: "ObjectProperties",
	frequency: 1,
	trusted: true,
	compression: true,
	blocks: [
		{
			name: "objectData",
			parameters: [
				["objectId", UUID],
				["creatorId", UUID],
				["ownerId", UUID],
				["groupId", UUID],
				["creationDate", U64],
				["baseMask", U32],
				["ownerMask", U32],
				["groupMask", U32],
				["everyoneMask", U32],
				["nextOwnerMask", U32],
				["ownershipCost", S32],
				["saleType", U8],
				["salePrice", S32],
				["aggregatePerms", U8],
				["aggregatePermTextures", U8],
				["aggregatePermTexturesOwner", U8],
				["category", U32],
				["inventorySerial", S16],
				["itemId", UUID],
				["folderId", UUID],
				["fromTaskId", UUID],
				["lastOwnerId", UUID],
				["name", Variable1],
				["description", Variable1],
				["touchName", Variable1],
				["sitName", Variable1],
				["textureId", Variable1],
			],
			multiple: true,
		},
	],
} satisfies PacketMetadata

export const objectProperties = createPacketSender<ObjectPropertiesData>(
	objectPropertiesMetadata,
)

export const createObjectPropertiesDelegate =
	createPacketDelegate<ObjectPropertiesData>(objectPropertiesMetadata)

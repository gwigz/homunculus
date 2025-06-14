/**
 * ParcelProperties Packet
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
import {
	Bool,
	F32,
	S32,
	U8,
	U32,
	UUID,
	Variable1,
	Variable2,
	Vector3,
} from "../types"

export interface ParcelPropertiesData {
	parcelData?: {
		requestResult: number
		sequenceId: number
		snapSelection: boolean
		selfCount: number
		otherCount: number
		publicCount: number
		localId: number
		ownerId: string
		isGroupOwned: boolean
		auctionId: number
		claimDate: number
		claimPrice: number
		rentPrice: number
		aabbMin: Vector3
		aabbMax: Vector3
		bitmap: string | Buffer
		area: number
		status: number
		simWideMaxPrims: number
		simWideTotalPrims: number
		maxPrims: number
		totalPrims: number
		ownerPrims: number
		groupPrims: number
		otherPrims: number
		selectedPrims: number
		parcelPrimBonus: number
		otherCleanTime: number
		parcelFlags: number
		salePrice: number
		name: string | Buffer
		desc: string | Buffer
		musicUrl: string | Buffer
		mediaUrl: string | Buffer
		mediaId: string
		mediaAutoScale: number
		groupId: string
		passPrice: number
		passHours: number
		category: number
		authBuyerId: string
		snapshotId: string
		userLocation: Vector3
		userLookAt: Vector3
		landingType: number
		regionPushOverride: boolean
		regionDenyAnonymous: boolean
		regionDenyIdentified: boolean
		regionDenyTransacted: boolean
	}
	ageVerificationBlock?: {
		regionDenyAgeUnverified: boolean
	}
	regionAllowAccessBlock?: {
		regionAllowAccessOverride: boolean
	}
	parcelEnvironmentBlock?: {
		parcelEnvironmentVersion: number
		regionAllowEnvironmentOverride: boolean
	}
}

export const parcelPropertiesMetadata = {
	id: 23,
	name: "ParcelProperties",
	trusted: true,
	compression: true,
	blocks: [
		{
			name: "parcelData",
			parameters: [
				["requestResult", S32],
				["sequenceId", S32],
				["snapSelection", Bool],
				["selfCount", S32],
				["otherCount", S32],
				["publicCount", S32],
				["localId", S32],
				["ownerId", UUID],
				["isGroupOwned", Bool],
				["auctionId", U32],
				["claimDate", S32],
				["claimPrice", S32],
				["rentPrice", S32],
				["aabbMin", Vector3],
				["aabbMax", Vector3],
				["bitmap", Variable2],
				["area", S32],
				["status", U8],
				["simWideMaxPrims", S32],
				["simWideTotalPrims", S32],
				["maxPrims", S32],
				["totalPrims", S32],
				["ownerPrims", S32],
				["groupPrims", S32],
				["otherPrims", S32],
				["selectedPrims", S32],
				["parcelPrimBonus", F32],
				["otherCleanTime", S32],
				["parcelFlags", U32],
				["salePrice", S32],
				["name", Variable1],
				["desc", Variable1],
				["musicUrl", Variable1],
				["mediaUrl", Variable1],
				["mediaId", UUID],
				["mediaAutoScale", U8],
				["groupId", UUID],
				["passPrice", S32],
				["passHours", F32],
				["category", U8],
				["authBuyerId", UUID],
				["snapshotId", UUID],
				["userLocation", Vector3],
				["userLookAt", Vector3],
				["landingType", U8],
				["regionPushOverride", Bool],
				["regionDenyAnonymous", Bool],
				["regionDenyIdentified", Bool],
				["regionDenyTransacted", Bool],
			],
		},
		{
			name: "ageVerificationBlock",
			parameters: [["regionDenyAgeUnverified", Bool]],
		},
		{
			name: "regionAllowAccessBlock",
			parameters: [["regionAllowAccessOverride", Bool]],
		},
		{
			name: "parcelEnvironmentBlock",
			parameters: [
				["parcelEnvironmentVersion", S32],
				["regionAllowEnvironmentOverride", Bool],
			],
		},
	],
} satisfies PacketMetadata

export const parcelProperties = createPacketSender<ParcelPropertiesData>(
	parcelPropertiesMetadata,
)

export const createParcelPropertiesDelegate =
	createPacketDelegate<ParcelPropertiesData>(parcelPropertiesMetadata)

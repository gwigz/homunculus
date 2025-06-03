import type { ParcelPropertiesData } from "~/network"

// export interface ParcelPropertiesData {
// 	parcelData?: {

// 		localId: number -> id
// 		ownerId: string -> ownerKey
// 		isGroupOwned: boolean -> isGroupOwned
// 		maxPrims: number -> maxPrims
// 		totalPrims: number -> totalPrims
// 		ownerPrims: number -> ownerPrims
// 		groupPrims: number -> groupPrims
// 		otherPrims: number -> otherPrims
// 		selectedPrims: number -> selectedPrims
// 		parcelPrimBonus: number -> parcelPrimBonus
// 		parcelFlags: number -> parcelFlags
// 		name: string | Buffer -> name
// 		desc: string | Buffer -> description
// 		musicUrl: string | Buffer -> musicUrl
// 		mediaUrl: string | Buffer -> mediaUrl
// 		groupId: string -> groupKey
// 		category: number -> category
// 		landingType: number -> landingType
// }

export class Parcel {
	public readonly id: number
	public readonly name: string
	public readonly description: string
	public readonly category: number

	public readonly parcelFlags: number
	public readonly regionPushOverride: boolean
	public readonly landingType: number

	public readonly ownerKey: string
	public readonly groupKey: string
	public readonly isGroupOwned: boolean

	public readonly maxPrims: number
	public readonly totalPrims: number
	public readonly ownerPrims: number
	public readonly groupPrims: number
	public readonly otherPrims: number
	public readonly selectedPrims: number
	public readonly parcelPrimBonus: number

	public readonly musicUrl: string
	public readonly mediaUrl: string

	/**
	 * @internal
	 */
	constructor(
		// private readonly client: Client,
		data: ParcelPropertiesData,
	) {
		const parcelData = data.parcelData!

		this.id = parcelData.localId
		this.name = parcelData.name.toString("utf8").slice(0, -1)
		this.description = parcelData.desc.toString("utf8").slice(0, -1)
		this.category = parcelData.category

		this.parcelFlags = parcelData.parcelFlags
		this.regionPushOverride = parcelData.regionPushOverride
		this.landingType = parcelData.landingType

		this.ownerKey = parcelData.ownerId
		this.groupKey = parcelData.groupId
		this.isGroupOwned = parcelData.isGroupOwned

		this.maxPrims = parcelData.maxPrims
		this.totalPrims = parcelData.totalPrims
		this.ownerPrims = parcelData.ownerPrims
		this.groupPrims = parcelData.groupPrims
		this.otherPrims = parcelData.otherPrims
		this.selectedPrims = parcelData.selectedPrims
		this.parcelPrimBonus = parcelData.parcelPrimBonus

		this.musicUrl = parcelData.musicUrl.toString("utf8").slice(0, -1)
		this.mediaUrl = parcelData.mediaUrl.toString("utf8").slice(0, -1)
	}
}

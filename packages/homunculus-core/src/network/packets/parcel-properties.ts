import Packet from "./packet"

import * as Types from "../types"

/**
 * ParcelProperties Packet
 */
class ParcelProperties extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 23

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 */
	public static frequency = 2

	/**
	 * If this value is true, the client cannot send this packet as circuits only
	 * accept trusted packets from internal connections (to utility servers etc).
	 */
	public static trusted = true

	/**
	 * States if this packet should use or be using zerocoding, to attempt to
	 * compress the sequences of zeros in the message in order to reduce network
	 * load.
	 */
	public static compression = true

	/**
	 * Determines the blocks that are are contained in the message and it's
	 * required parameters.
	 *
	 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
	 */
	public static format: Map<string, any> = new Map([
		[
			"parcelData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["requestResult", Types.S32],
					["sequence", Types.S32],
					["snapSelection", Types.Boolean],
					["selfCount", Types.S32],
					["otherCount", Types.S32],
					["publicCount", Types.S32],
					["local", Types.S32],
					["owner", Types.UUID],
					["isGroupOwned", Types.Boolean],
					["auction", Types.U32],
					["claimDate", Types.S32],
					["claimPrice", Types.S32],
					["rentPrice", Types.S32],
					["aABBMin", Types.Vector3],
					["aABBMax", Types.Vector3],
					["bitmap", Types.Variable2],
					["area", Types.S32],
					["status", Types.U8],
					["simWideMaxPrims", Types.S32],
					["simWideTotalPrims", Types.S32],
					["maxPrims", Types.S32],
					["totalPrims", Types.S32],
					["ownerPrims", Types.S32],
					["groupPrims", Types.S32],
					["otherPrims", Types.S32],
					["selectedPrims", Types.S32],
					["parcelPrimBonus", Types.F32],
					["otherCleanTime", Types.S32],
					["parcelFlags", Types.U32],
					["salePrice", Types.S32],
					["name", Types.Variable1],
					["desc", Types.Variable1],
					["musicURL", Types.Variable1],
					["mediaURL", Types.Variable1],
					["media", Types.UUID],
					["mediaAutoScale", Types.U8],
					["group", Types.UUID],
					["passPrice", Types.S32],
					["passHours", Types.F32],
					["category", Types.U8],
					["authBuyer", Types.UUID],
					["snapshot", Types.UUID],
					["userLocation", Types.Vector3],
					["userLookAt", Types.Vector3],
					["landingType", Types.U8],
					["regionPushOverride", Types.Boolean],
					["regionDenyAnonymous", Types.Boolean],
					["regionDenyIdentified", Types.Boolean],
					["regionDenyTransacted", Types.Boolean],
				]),
			},
		],
		[
			"ageVerificationBlock",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["regionDenyAgeUnverified", Types.Boolean],
				]),
			},
		],
	])

	/**
	 * ParcelProperties constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ParcelProperties.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {S32} [data.parcelData.requestResult] RequestResult
	 * @param {S32} [data.parcelData.sequence] SequenceID
	 * @param {boolean} [data.parcelData.snapSelection] SnapSelection
	 * @param {S32} [data.parcelData.selfCount] SelfCount
	 * @param {S32} [data.parcelData.otherCount] OtherCount
	 * @param {S32} [data.parcelData.publicCount] PublicCount
	 * @param {S32} [data.parcelData.local] LocalID
	 * @param {string} [data.parcelData.owner] OwnerID
	 * @param {boolean} [data.parcelData.isGroupOwned] IsGroupOwned
	 * @param {U32} [data.parcelData.auction] AuctionID
	 * @param {S32} [data.parcelData.claimDate] ClaimDate
	 * @param {S32} [data.parcelData.claimPrice] ClaimPrice
	 * @param {S32} [data.parcelData.rentPrice] RentPrice
	 * @param {Vector3} [data.parcelData.aABBMin] AABBMin
	 * @param {Vector3} [data.parcelData.aABBMax] AABBMax
	 * @param {Variable2} [data.parcelData.bitmap] Bitmap
	 * @param {S32} [data.parcelData.area] Area
	 * @param {U8} [data.parcelData.status] Status
	 * @param {S32} [data.parcelData.simWideMaxPrims] SimWideMaxPrims
	 * @param {S32} [data.parcelData.simWideTotalPrims] SimWideTotalPrims
	 * @param {S32} [data.parcelData.maxPrims] MaxPrims
	 * @param {S32} [data.parcelData.totalPrims] TotalPrims
	 * @param {S32} [data.parcelData.ownerPrims] OwnerPrims
	 * @param {S32} [data.parcelData.groupPrims] GroupPrims
	 * @param {S32} [data.parcelData.otherPrims] OtherPrims
	 * @param {S32} [data.parcelData.selectedPrims] SelectedPrims
	 * @param {F32} [data.parcelData.parcelPrimBonus] ParcelPrimBonus
	 * @param {S32} [data.parcelData.otherCleanTime] OtherCleanTime
	 * @param {U32} [data.parcelData.parcelFlags] ParcelFlags
	 * @param {S32} [data.parcelData.salePrice] SalePrice
	 * @param {Variable1} [data.parcelData.name] Name
	 * @param {Variable1} [data.parcelData.desc] Desc
	 * @param {Variable1} [data.parcelData.musicURL] MusicURL
	 * @param {Variable1} [data.parcelData.mediaURL] MediaURL
	 * @param {string} [data.parcelData.media] MediaID
	 * @param {U8} [data.parcelData.mediaAutoScale] MediaAutoScale
	 * @param {string} [data.parcelData.group] GroupID
	 * @param {S32} [data.parcelData.passPrice] PassPrice
	 * @param {F32} [data.parcelData.passHours] PassHours
	 * @param {U8} [data.parcelData.category] Category
	 * @param {string} [data.parcelData.authBuyer] AuthBuyerID
	 * @param {string} [data.parcelData.snapshot] SnapshotID
	 * @param {Vector3} [data.parcelData.userLocation] UserLocation
	 * @param {Vector3} [data.parcelData.userLookAt] UserLookAt
	 * @param {U8} [data.parcelData.landingType] LandingType
	 * @param {boolean} [data.parcelData.regionPushOverride] RegionPushOverride
	 * @param {boolean} [data.parcelData.regionDenyAnonymous] RegionDenyAnonymous
	 * @param {boolean} [data.parcelData.regionDenyIdentified] RegionDenyIdentified
	 * @param {boolean} [data.parcelData.regionDenyTransacted] RegionDenyTransacted
	 * @param {boolean} [data.ageVerificationBlock.regionDenyAgeUnverified] RegionDenyAgeUnverified
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ParcelProperties

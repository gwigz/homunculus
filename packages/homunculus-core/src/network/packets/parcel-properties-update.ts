import * as Types from "../types"
import Packet from "./packet"

/**
 * ParcelPropertiesUpdate Packet
 */
class ParcelPropertiesUpdate extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 198

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 */
	public static frequency = 0

	/**
	 * If this value is true, the client cannot send this packet as circuits only
	 * accept trusted packets from internal connections (to utility servers etc).
	 */
	public static trusted = false

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
			"agentData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["agent", Types.UUID],
					["session", Types.UUID],
				]),
			},
		],
		[
			"parcelData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["local", Types.S32],
					["flags", Types.U32],
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
				]),
			},
		],
	])

	/**
	 * ParcelPropertiesUpdate constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ParcelPropertiesUpdate.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {S32} [data.parcelData.local] LocalID
	 * @param {U32} [data.parcelData.flags] Flags
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
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ParcelPropertiesUpdate

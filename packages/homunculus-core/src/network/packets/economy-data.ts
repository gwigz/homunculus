import * as Types from "../types"
import Packet from "./packet"

/**
 * EconomyData Packet
 */
class EconomyData extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static override id = 25

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 */
	public static override frequency = 0

	/**
	 * If this value is true, the client cannot send this packet as circuits only
	 * accept trusted packets from internal connections (to utility servers etc).
	 */
	public static override trusted = true

	/**
	 * States if this packet should use or be using zerocoding, to attempt to
	 * compress the sequences of zeros in the message in order to reduce network
	 * load.
	 */
	public static override compression = true

	/**
	 * Determines the blocks that are are contained in the message and it's
	 * required parameters.
	 *
	 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
	 */
	public static override format: Map<string, any> = new Map([
		[
			"info",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["objectCapacity", Types.S32],
					["objectCount", Types.S32],
					["priceEnergyUnit", Types.S32],
					["priceObjectClaim", Types.S32],
					["pricePublicObjectDecay", Types.S32],
					["pricePublicObjectDelete", Types.S32],
					["priceParcelClaim", Types.S32],
					["priceParcelClaimFactor", Types.F32],
					["priceUpload", Types.S32],
					["priceRentLight", Types.S32],
					["teleportMinPrice", Types.S32],
					["teleportPriceExponent", Types.F32],
					["energyEfficiency", Types.F32],
					["priceObjectRent", Types.F32],
					["priceObjectScaleFactor", Types.F32],
					["priceParcelRent", Types.S32],
					["priceGroupCreate", Types.S32],
				]),
			},
		],
	])

	/**
	 * EconomyData constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link EconomyData.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {S32} [data.info.objectCapacity] ObjectCapacity
	 * @param {S32} [data.info.objectCount] ObjectCount
	 * @param {S32} [data.info.priceEnergyUnit] PriceEnergyUnit
	 * @param {S32} [data.info.priceObjectClaim] PriceObjectClaim
	 * @param {S32} [data.info.pricePublicObjectDecay] PricePublicObjectDecay
	 * @param {S32} [data.info.pricePublicObjectDelete] PricePublicObjectDelete
	 * @param {S32} [data.info.priceParcelClaim] PriceParcelClaim
	 * @param {F32} [data.info.priceParcelClaimFactor] PriceParcelClaimFactor
	 * @param {S32} [data.info.priceUpload] PriceUpload
	 * @param {S32} [data.info.priceRentLight] PriceRentLight
	 * @param {S32} [data.info.teleportMinPrice] TeleportMinPrice
	 * @param {F32} [data.info.teleportPriceExponent] TeleportPriceExponent
	 * @param {F32} [data.info.energyEfficiency] EnergyEfficiency
	 * @param {F32} [data.info.priceObjectRent] PriceObjectRent
	 * @param {F32} [data.info.priceObjectScaleFactor] PriceObjectScaleFactor
	 * @param {S32} [data.info.priceParcelRent] PriceParcelRent
	 * @param {S32} [data.info.priceGroupCreate] PriceGroupCreate
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default EconomyData

import * as Types from "../types"
import Packet from "./packet"

/**
 * RegionInfo Packet
 */
class RegionInfo extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 142

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
			"regionInfo",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["simName", Types.Variable1],
					["estate", Types.U32],
					["parentEstate", Types.U32],
					["regionFlags", Types.U32],
					["simAccess", Types.U8],
					["maxAgents", Types.U8],
					["billableFactor", Types.F32],
					["objectBonusFactor", Types.F32],
					["waterHeight", Types.F32],
					["terrainRaiseLimit", Types.F32],
					["terrainLowerLimit", Types.F32],
					["pricePerMeter", Types.S32],
					["redirectGridX", Types.S32],
					["redirectGridY", Types.S32],
					["useEstateSun", Types.Boolean],
					["sunHour", Types.F32],
				]),
			},
		],
		[
			"regionInfo2",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["productSKU", Types.Variable1],
					["productName", Types.Variable1],
					["maxAgents32", Types.U32],
					["hardMaxAgents", Types.U32],
					["hardMaxObjects", Types.U32],
				]),
			},
		],
	])

	/**
	 * RegionInfo constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link RegionInfo.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {Variable1} [data.regionInfo.simName] SimName
	 * @param {U32} [data.regionInfo.estate] EstateID
	 * @param {U32} [data.regionInfo.parentEstate] ParentEstateID
	 * @param {U32} [data.regionInfo.regionFlags] RegionFlags
	 * @param {U8} [data.regionInfo.simAccess] SimAccess
	 * @param {U8} [data.regionInfo.maxAgents] MaxAgents
	 * @param {F32} [data.regionInfo.billableFactor] BillableFactor
	 * @param {F32} [data.regionInfo.objectBonusFactor] ObjectBonusFactor
	 * @param {F32} [data.regionInfo.waterHeight] WaterHeight
	 * @param {F32} [data.regionInfo.terrainRaiseLimit] TerrainRaiseLimit
	 * @param {F32} [data.regionInfo.terrainLowerLimit] TerrainLowerLimit
	 * @param {S32} [data.regionInfo.pricePerMeter] PricePerMeter
	 * @param {S32} [data.regionInfo.redirectGridX] RedirectGridX
	 * @param {S32} [data.regionInfo.redirectGridY] RedirectGridY
	 * @param {boolean} [data.regionInfo.useEstateSun] UseEstateSun
	 * @param {F32} [data.regionInfo.sunHour] SunHour
	 * @param {Variable1} [data.regionInfo2.productSKU] ProductSKU
	 * @param {Variable1} [data.regionInfo2.productName] ProductName
	 * @param {U32} [data.regionInfo2.maxAgents32] MaxAgents32
	 * @param {U32} [data.regionInfo2.hardMaxAgents] HardMaxAgents
	 * @param {U32} [data.regionInfo2.hardMaxObjects] HardMaxObjects
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default RegionInfo

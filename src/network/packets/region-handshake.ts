import { Collection } from "../../utilities"
import Packet from "./packet"

import * as Types from "../types"

/**
 * RegionHandshake Packet
 */
class RegionHandshake extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 *
	 * @type {number}
	 */
	public static id = 148

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 *
	 * @type {number}
	 */
	public static frequency = 0

	/**
	 * If this value is true, the client cannot send this packet as circuits only
	 * accept trusted packets from internal connections (to utility servers etc).
	 *
	 * @type {boolean}
	 */
	public static trusted = true

	/**
	 * States if this packet should use or be using zerocoding, to attempt to
	 * compress the sequences of zeros in the message in order to reduce network
	 * load.
	 *
	 * @type {boolean}
	 */
	public static compression = true

	/**
	 * Determines the blocks that are are contained in the message and it's
	 * required parameters.
	 *
	 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
	 * @type {Collection}
	 */
	public static format: Collection<string, any> = new Collection([
		// tslint:disable-next-line:max-line-length
		[
			"regionInfo",
			{
				quantity: 1,
				parameters: new Collection<string, any>([
					["regionFlags", Types.U32],
					["simAccess", Types.U8],
					["simName", Types.Variable1],
					["simOwner", Types.UUID],
					["isEstateManager", Types.Boolean],
					["waterHeight", Types.F32],
					["billableFactor", Types.F32],
					["cache", Types.UUID],
					["terrainBase0", Types.UUID],
					["terrainBase1", Types.UUID],
					["terrainBase2", Types.UUID],
					["terrainBase3", Types.UUID],
					["terrainDetail0", Types.UUID],
					["terrainDetail1", Types.UUID],
					["terrainDetail2", Types.UUID],
					["terrainDetail3", Types.UUID],
					["terrainStartHeight00", Types.F32],
					["terrainStartHeight01", Types.F32],
					["terrainStartHeight10", Types.F32],
					["terrainStartHeight11", Types.F32],
					["terrainHeightRange00", Types.F32],
					["terrainHeightRange01", Types.F32],
					["terrainHeightRange10", Types.F32],
					["terrainHeightRange11", Types.F32],
				]),
			},
		],
		// tslint:disable-next-line:max-line-length
		[
			"regionInfo2",
			{
				quantity: 1,
				parameters: new Collection<string, any>([["region", Types.UUID]]),
			},
		],
		// tslint:disable-next-line:max-line-length
		[
			"regionInfo3",
			{
				quantity: 1,
				parameters: new Collection<string, any>([
					["cPUClass", Types.S32],
					["cPURatio", Types.S32],
					["coloName", Types.Variable1],
					["productSKU", Types.Variable1],
					["productName", Types.Variable1],
				]),
			},
		],
	])

	/**
	 * RegionHandshake constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link RegionHandshake.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {U32} [data.regionInfo.regionFlags] RegionFlags
	 * @param {U8} [data.regionInfo.simAccess] SimAccess
	 * @param {Variable1} [data.regionInfo.simName] SimName
	 * @param {string} [data.regionInfo.simOwner] SimOwner
	 * @param {boolean} [data.regionInfo.isEstateManager] IsEstateManager
	 * @param {F32} [data.regionInfo.waterHeight] WaterHeight
	 * @param {F32} [data.regionInfo.billableFactor] BillableFactor
	 * @param {string} [data.regionInfo.cache] CacheID
	 * @param {string} [data.regionInfo.terrainBase0] TerrainBase0
	 * @param {string} [data.regionInfo.terrainBase1] TerrainBase1
	 * @param {string} [data.regionInfo.terrainBase2] TerrainBase2
	 * @param {string} [data.regionInfo.terrainBase3] TerrainBase3
	 * @param {string} [data.regionInfo.terrainDetail0] TerrainDetail0
	 * @param {string} [data.regionInfo.terrainDetail1] TerrainDetail1
	 * @param {string} [data.regionInfo.terrainDetail2] TerrainDetail2
	 * @param {string} [data.regionInfo.terrainDetail3] TerrainDetail3
	 * @param {F32} [data.regionInfo.terrainStartHeight00] TerrainStartHeight00
	 * @param {F32} [data.regionInfo.terrainStartHeight01] TerrainStartHeight01
	 * @param {F32} [data.regionInfo.terrainStartHeight10] TerrainStartHeight10
	 * @param {F32} [data.regionInfo.terrainStartHeight11] TerrainStartHeight11
	 * @param {F32} [data.regionInfo.terrainHeightRange00] TerrainHeightRange00
	 * @param {F32} [data.regionInfo.terrainHeightRange01] TerrainHeightRange01
	 * @param {F32} [data.regionInfo.terrainHeightRange10] TerrainHeightRange10
	 * @param {F32} [data.regionInfo.terrainHeightRange11] TerrainHeightRange11
	 * @param {string} [data.regionInfo2.region] RegionID
	 * @param {S32} [data.regionInfo3.cPUClass] CPUClassID
	 * @param {S32} [data.regionInfo3.cPURatio] CPURatio
	 * @param {Variable1} [data.regionInfo3.coloName] ColoName
	 * @param {Variable1} [data.regionInfo3.productSKU] ProductSKU
	 * @param {Variable1} [data.regionInfo3.productName] ProductName
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default RegionHandshake

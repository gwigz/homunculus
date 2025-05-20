import { Collection } from "../../utilities"
import Packet from "./packet"

import * as Types from "../types"

/**
 * ObjectPropertiesFamily Packet
 */
class ObjectPropertiesFamily extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 *
	 * @type {number}
	 */
	public static id = 10

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 *
	 * @type {number}
	 */
	public static frequency = 1

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
			"objectData",
			{
				quantity: 1,
				parameters: new Collection<string, any>([
					["requestFlags", Types.U32],
					["object", Types.UUID],
					["owner", Types.UUID],
					["group", Types.UUID],
					["baseMask", Types.U32],
					["ownerMask", Types.U32],
					["groupMask", Types.U32],
					["everyoneMask", Types.U32],
					["nextOwnerMask", Types.U32],
					["ownershipCost", Types.S32],
					["saleType", Types.U8],
					["salePrice", Types.S32],
					["category", Types.U32],
					["lastOwner", Types.UUID],
					["name", Types.Variable1],
					["description", Types.Variable1],
				]),
			},
		],
	])

	/**
	 * ObjectPropertiesFamily constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ObjectPropertiesFamily.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {U32} [data.objectData.requestFlags] RequestFlags
	 * @param {string} [data.objectData.object] ObjectID
	 * @param {string} [data.objectData.owner] OwnerID
	 * @param {string} [data.objectData.group] GroupID
	 * @param {U32} [data.objectData.baseMask] BaseMask
	 * @param {U32} [data.objectData.ownerMask] OwnerMask
	 * @param {U32} [data.objectData.groupMask] GroupMask
	 * @param {U32} [data.objectData.everyoneMask] EveryoneMask
	 * @param {U32} [data.objectData.nextOwnerMask] NextOwnerMask
	 * @param {S32} [data.objectData.ownershipCost] OwnershipCost
	 * @param {U8} [data.objectData.saleType] SaleType
	 * @param {S32} [data.objectData.salePrice] SalePrice
	 * @param {U32} [data.objectData.category] Category
	 * @param {string} [data.objectData.lastOwner] LastOwnerID
	 * @param {Variable1} [data.objectData.name] Name
	 * @param {Variable1} [data.objectData.description] Description
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ObjectPropertiesFamily

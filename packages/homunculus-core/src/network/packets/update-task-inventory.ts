import * as Types from "../types"
import Packet from "./packet"

/**
 * UpdateTaskInventory Packet
 */
class UpdateTaskInventory extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 286

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
			"updateData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["local", Types.U32],
					["key", Types.U8],
				]),
			},
		],
		[
			"inventoryData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["item", Types.UUID],
					["folder", Types.UUID],
					["creator", Types.UUID],
					["owner", Types.UUID],
					["group", Types.UUID],
					["baseMask", Types.U32],
					["ownerMask", Types.U32],
					["groupMask", Types.U32],
					["everyoneMask", Types.U32],
					["nextOwnerMask", Types.U32],
					["groupOwned", Types.Boolean],
					["transaction", Types.UUID],
					["type", Types.S8],
					["invType", Types.S8],
					["flags", Types.U32],
					["saleType", Types.U8],
					["salePrice", Types.S32],
					["name", Types.Variable1],
					["description", Types.Variable1],
					["creationDate", Types.S32],
					["crc", Types.U32],
				]),
			},
		],
	])

	/**
	 * UpdateTaskInventory constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link UpdateTaskInventory.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {U32} [data.updateData.local] LocalID
	 * @param {U8} [data.updateData.key] Key
	 * @param {string} [data.inventoryData.item] ItemID
	 * @param {string} [data.inventoryData.folder] FolderID
	 * @param {string} [data.inventoryData.creator] CreatorID
	 * @param {string} [data.inventoryData.owner] OwnerID
	 * @param {string} [data.inventoryData.group] GroupID
	 * @param {U32} [data.inventoryData.baseMask] BaseMask
	 * @param {U32} [data.inventoryData.ownerMask] OwnerMask
	 * @param {U32} [data.inventoryData.groupMask] GroupMask
	 * @param {U32} [data.inventoryData.everyoneMask] EveryoneMask
	 * @param {U32} [data.inventoryData.nextOwnerMask] NextOwnerMask
	 * @param {boolean} [data.inventoryData.groupOwned] GroupOwned
	 * @param {string} [data.inventoryData.transaction] TransactionID
	 * @param {S8} [data.inventoryData.type] Type
	 * @param {S8} [data.inventoryData.invType] InvType
	 * @param {U32} [data.inventoryData.flags] Flags
	 * @param {U8} [data.inventoryData.saleType] SaleType
	 * @param {S32} [data.inventoryData.salePrice] SalePrice
	 * @param {Variable1} [data.inventoryData.name] Name
	 * @param {Variable1} [data.inventoryData.description] Description
	 * @param {S32} [data.inventoryData.creationDate] CreationDate
	 * @param {U32} [data.inventoryData.crc] CRC
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default UpdateTaskInventory

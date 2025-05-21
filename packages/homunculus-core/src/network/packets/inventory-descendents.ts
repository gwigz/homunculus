import * as Types from "../types"
import Packet from "./packet"

/**
 * InventoryDescendents Packet
 */
class InventoryDescendents extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 278

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
			"agentData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["agent", Types.UUID],
					["folder", Types.UUID],
					["owner", Types.UUID],
					["version", Types.S32],
					["descendents", Types.S32],
				]),
			},
		],
		[
			"folderData",
			{
				parameters: new Map<string, any>([
					["folder", Types.UUID],
					["parent", Types.UUID],
					["type", Types.S8],
					["name", Types.Variable1],
				]),
			},
		],
		[
			"itemData",
			{
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
					["asset", Types.UUID],
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
	 * InventoryDescendents constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link InventoryDescendents.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.folder] FolderID
	 * @param {string} [data.agentData.owner] OwnerID
	 * @param {S32} [data.agentData.version] Version
	 * @param {S32} [data.agentData.descendents] Descendents
	 * @param {string} [data.folderData.folder] FolderID
	 * @param {string} [data.folderData.parent] ParentID
	 * @param {S8} [data.folderData.type] Type
	 * @param {Variable1} [data.folderData.name] Name
	 * @param {string} [data.itemData.item] ItemID
	 * @param {string} [data.itemData.folder] FolderID
	 * @param {string} [data.itemData.creator] CreatorID
	 * @param {string} [data.itemData.owner] OwnerID
	 * @param {string} [data.itemData.group] GroupID
	 * @param {U32} [data.itemData.baseMask] BaseMask
	 * @param {U32} [data.itemData.ownerMask] OwnerMask
	 * @param {U32} [data.itemData.groupMask] GroupMask
	 * @param {U32} [data.itemData.everyoneMask] EveryoneMask
	 * @param {U32} [data.itemData.nextOwnerMask] NextOwnerMask
	 * @param {boolean} [data.itemData.groupOwned] GroupOwned
	 * @param {string} [data.itemData.asset] AssetID
	 * @param {S8} [data.itemData.type] Type
	 * @param {S8} [data.itemData.invType] InvType
	 * @param {U32} [data.itemData.flags] Flags
	 * @param {U8} [data.itemData.saleType] SaleType
	 * @param {S32} [data.itemData.salePrice] SalePrice
	 * @param {Variable1} [data.itemData.name] Name
	 * @param {Variable1} [data.itemData.description] Description
	 * @param {S32} [data.itemData.creationDate] CreationDate
	 * @param {U32} [data.itemData.crc] CRC
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default InventoryDescendents

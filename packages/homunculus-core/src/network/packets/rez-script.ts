import * as Types from "../types"
import Packet from "./packet"

/**
 * RezScript Packet
 */
class RezScript extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static override id = 304

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
	public static override trusted = false

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
			"agentData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["agent", Types.UUID],
					["session", Types.UUID],
					["group", Types.UUID],
				]),
			},
		],
		[
			"updateBlock",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["objectLocal", Types.U32],
					["enabled", Types.Boolean],
				]),
			},
		],
		[
			"inventoryBlock",
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
	 * RezScript constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link RezScript.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {string} [data.agentData.group] GroupID
	 * @param {U32} [data.updateBlock.objectLocal] ObjectLocalID
	 * @param {boolean} [data.updateBlock.enabled] Enabled
	 * @param {string} [data.inventoryBlock.item] ItemID
	 * @param {string} [data.inventoryBlock.folder] FolderID
	 * @param {string} [data.inventoryBlock.creator] CreatorID
	 * @param {string} [data.inventoryBlock.owner] OwnerID
	 * @param {string} [data.inventoryBlock.group] GroupID
	 * @param {U32} [data.inventoryBlock.baseMask] BaseMask
	 * @param {U32} [data.inventoryBlock.ownerMask] OwnerMask
	 * @param {U32} [data.inventoryBlock.groupMask] GroupMask
	 * @param {U32} [data.inventoryBlock.everyoneMask] EveryoneMask
	 * @param {U32} [data.inventoryBlock.nextOwnerMask] NextOwnerMask
	 * @param {boolean} [data.inventoryBlock.groupOwned] GroupOwned
	 * @param {string} [data.inventoryBlock.transaction] TransactionID
	 * @param {S8} [data.inventoryBlock.type] Type
	 * @param {S8} [data.inventoryBlock.invType] InvType
	 * @param {U32} [data.inventoryBlock.flags] Flags
	 * @param {U8} [data.inventoryBlock.saleType] SaleType
	 * @param {S32} [data.inventoryBlock.salePrice] SalePrice
	 * @param {Variable1} [data.inventoryBlock.name] Name
	 * @param {Variable1} [data.inventoryBlock.description] Description
	 * @param {S32} [data.inventoryBlock.creationDate] CreationDate
	 * @param {U32} [data.inventoryBlock.crc] CRC
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default RezScript

import * as Types from "../types"
import Packet from "./packet"

/**
 * CreateInventoryItem Packet
 */
class CreateInventoryItem extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 305

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
			"inventoryBlock",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["callback", Types.U32],
					["folder", Types.UUID],
					["transaction", Types.UUID],
					["nextOwnerMask", Types.U32],
					["type", Types.S8],
					["invType", Types.S8],
					["wearableType", Types.U8],
					["name", Types.Variable1],
					["description", Types.Variable1],
				]),
			},
		],
	])

	/**
	 * CreateInventoryItem constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link CreateInventoryItem.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {U32} [data.inventoryBlock.callback] CallbackID
	 * @param {string} [data.inventoryBlock.folder] FolderID
	 * @param {string} [data.inventoryBlock.transaction] TransactionID
	 * @param {U32} [data.inventoryBlock.nextOwnerMask] NextOwnerMask
	 * @param {S8} [data.inventoryBlock.type] Type
	 * @param {S8} [data.inventoryBlock.invType] InvType
	 * @param {U8} [data.inventoryBlock.wearableType] WearableType
	 * @param {Variable1} [data.inventoryBlock.name] Name
	 * @param {Variable1} [data.inventoryBlock.description] Description
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default CreateInventoryItem

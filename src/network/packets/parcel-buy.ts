import { Collection } from "../../utilities"
import Packet from "./packet"

import * as Types from "../types"

/**
 * ParcelBuy Packet
 */
class ParcelBuy extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 *
	 * @type {number}
	 */
	public static id = 213

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
	public static trusted = false

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
			"agentData",
			{
				quantity: 1,
				parameters: new Collection<string, any>([
					["agent", Types.UUID],
					["session", Types.UUID],
				]),
			},
		],
		// tslint:disable-next-line:max-line-length
		[
			"data",
			{
				quantity: 1,
				parameters: new Collection<string, any>([
					["group", Types.UUID],
					["isGroupOwned", Types.Boolean],
					["removeContribution", Types.Boolean],
					["local", Types.S32],
					["final", Types.Boolean],
				]),
			},
		],
		// tslint:disable-next-line:max-line-length
		[
			"parcelData",
			{
				quantity: 1,
				parameters: new Collection<string, any>([
					["price", Types.S32],
					["area", Types.S32],
				]),
			},
		],
	])

	/**
	 * ParcelBuy constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ParcelBuy.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {string} [data.data.group] GroupID
	 * @param {boolean} [data.data.isGroupOwned] IsGroupOwned
	 * @param {boolean} [data.data.removeContribution] RemoveContribution
	 * @param {S32} [data.data.local] LocalID
	 * @param {boolean} [data.data.final] Final
	 * @param {S32} [data.parcelData.price] Price
	 * @param {S32} [data.parcelData.area] Area
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ParcelBuy

import { Collection } from "../../utilities"
import Packet from "./packet"

import * as Types from "../types"

/**
 * ImageData Packet
 */
class ImageData extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 *
	 * @type {number}
	 */
	public static id = 9

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 *
	 * @type {number}
	 */
	public static frequency = 2

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
	public static compression = false

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
			"image",
			{
				quantity: 1,
				parameters: new Collection<string, any>([
					["id", Types.UUID],
					["codec", Types.U8],
					["size", Types.U32],
					["packets", Types.U16],
				]),
			},
		],
		// tslint:disable-next-line:max-line-length
		[
			"imageData",
			{
				quantity: 1,
				parameters: new Collection<string, any>([["data", Types.Variable2]]),
			},
		],
	])

	/**
	 * ImageData constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ImageData.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.image.id] ID
	 * @param {U8} [data.image.codec] Codec
	 * @param {U32} [data.image.size] Size
	 * @param {U16} [data.image.packets] Packets
	 * @param {Variable2} [data.imageData.data] Data
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ImageData

import Packet from "./packet"

import * as Types from "../types"

/**
 * MapBlockRequest Packet
 */
class MapBlockRequest extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 407

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
	public static compression = false

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
					["flags", Types.U32],
					["estate", Types.U32],
					["godlike", Types.Boolean],
				]),
			},
		],
		[
			"positionData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["minX", Types.U16],
					["maxX", Types.U16],
					["minY", Types.U16],
					["maxY", Types.U16],
				]),
			},
		],
	])

	/**
	 * MapBlockRequest constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link MapBlockRequest.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {U32} [data.agentData.flags] Flags
	 * @param {U32} [data.agentData.estate] EstateID
	 * @param {boolean} [data.agentData.godlike] Godlike
	 * @param {U16} [data.positionData.minX] MinX
	 * @param {U16} [data.positionData.maxX] MaxX
	 * @param {U16} [data.positionData.minY] MinY
	 * @param {U16} [data.positionData.maxY] MaxY
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default MapBlockRequest

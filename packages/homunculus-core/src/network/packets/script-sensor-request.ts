import * as Types from "../types"
import Packet from "./packet"

/**
 * ScriptSensorRequest Packet
 */
class ScriptSensorRequest extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static override id = 247

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
	public static override trusted = true

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
			"requester",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["source", Types.UUID],
					["request", Types.UUID],
					["search", Types.UUID],
					["searchPos", Types.Vector3],
					["searchDir", Types.Quaternion],
					["searchName", Types.Variable1],
					["type", Types.S32],
					["range", Types.F32],
					["arc", Types.F32],
					["regionHandle", Types.U64],
					["searchRegions", Types.U8],
				]),
			},
		],
	])

	/**
	 * ScriptSensorRequest constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ScriptSensorRequest.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {string} [data.requester.source] SourceID
	 * @param {string} [data.requester.request] RequestID
	 * @param {string} [data.requester.search] SearchID
	 * @param {Vector3} [data.requester.searchPos] SearchPos
	 * @param {Quaternion} [data.requester.searchDir] SearchDir
	 * @param {Variable1} [data.requester.searchName] SearchName
	 * @param {S32} [data.requester.type] Type
	 * @param {F32} [data.requester.range] Range
	 * @param {F32} [data.requester.arc] Arc
	 * @param {U64} [data.requester.regionHandle] RegionHandle
	 * @param {U8} [data.requester.searchRegions] SearchRegions
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ScriptSensorRequest

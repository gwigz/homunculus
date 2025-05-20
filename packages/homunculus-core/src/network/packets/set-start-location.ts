import * as Types from "../types"
import Packet from "./packet"

/**
 * SetStartLocation Packet
 */
class SetStartLocation extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 325

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
			"startLocationData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["agent", Types.UUID],
					["region", Types.UUID],
					["location", Types.U32],
					["regionHandle", Types.U64],
					["locationPos", Types.Vector3],
					["locationLookAt", Types.Vector3],
				]),
			},
		],
	])

	/**
	 * SetStartLocation constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link SetStartLocation.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.startLocationData.agent] AgentID
	 * @param {string} [data.startLocationData.region] RegionID
	 * @param {U32} [data.startLocationData.location] LocationID
	 * @param {U64} [data.startLocationData.regionHandle] RegionHandle
	 * @param {Vector3} [data.startLocationData.locationPos] LocationPos
	 * @param {Vector3} [data.startLocationData.locationLookAt] LocationLookAt
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default SetStartLocation

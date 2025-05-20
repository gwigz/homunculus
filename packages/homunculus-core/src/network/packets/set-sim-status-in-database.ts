import * as Types from "../types"
import Packet from "./packet"

/**
 * SetSimStatusInDatabase Packet
 */
class SetSimStatusInDatabase extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 22

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
	public static compression = false

	/**
	 * Determines the blocks that are are contained in the message and it's
	 * required parameters.
	 *
	 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
	 */
	public static format: Map<string, any> = new Map([
		[
			"data",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["region", Types.UUID],
					["hostName", Types.Variable1],
					["x", Types.S32],
					["y", Types.S32],
					["pID", Types.S32],
					["agentCount", Types.S32],
					["timeToLive", Types.S32],
					["status", Types.Variable1],
				]),
			},
		],
	])

	/**
	 * SetSimStatusInDatabase constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link SetSimStatusInDatabase.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.data.region] RegionID
	 * @param {Variable1} [data.data.hostName] HostName
	 * @param {S32} [data.data.x] X
	 * @param {S32} [data.data.y] Y
	 * @param {S32} [data.data.pID] PID
	 * @param {S32} [data.data.agentCount] AgentCount
	 * @param {S32} [data.data.timeToLive] TimeToLive
	 * @param {Variable1} [data.data.status] Status
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default SetSimStatusInDatabase

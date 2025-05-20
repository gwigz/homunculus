import * as Types from "../types"
import Packet from "./packet"

/**
 * SetSimPresenceInDatabase Packet
 */
class SetSimPresenceInDatabase extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 23

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
			"simData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["region", Types.UUID],
					["hostName", Types.Variable1],
					["gridX", Types.U32],
					["gridY", Types.U32],
					["pID", Types.S32],
					["agentCount", Types.S32],
					["timeToLive", Types.S32],
					["status", Types.Variable1],
				]),
			},
		],
	])

	/**
	 * SetSimPresenceInDatabase constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link SetSimPresenceInDatabase.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.simData.region] RegionID
	 * @param {Variable1} [data.simData.hostName] HostName
	 * @param {U32} [data.simData.gridX] GridX
	 * @param {U32} [data.simData.gridY] GridY
	 * @param {S32} [data.simData.pID] PID
	 * @param {S32} [data.simData.agentCount] AgentCount
	 * @param {S32} [data.simData.timeToLive] TimeToLive
	 * @param {Variable1} [data.simData.status] Status
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default SetSimPresenceInDatabase

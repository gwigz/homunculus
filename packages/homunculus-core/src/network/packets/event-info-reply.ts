import * as Types from "../types"
import Packet from "./packet"

/**
 * EventInfoReply Packet
 */
class EventInfoReply extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 180

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
			"agentData",
			{
				quantity: 1,
				parameters: new Map<string, any>([["agent", Types.UUID]]),
			},
		],
		[
			"eventData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["event", Types.U32],
					["creator", Types.Variable1],
					["name", Types.Variable1],
					["category", Types.Variable1],
					["desc", Types.Variable2],
					["date", Types.Variable1],
					["dateUTC", Types.U32],
					["duration", Types.U32],
					["cover", Types.U32],
					["amount", Types.U32],
					["simName", Types.Variable1],
					["globalPos", Types.Vector3D],
					["eventFlags", Types.U32],
				]),
			},
		],
	])

	/**
	 * EventInfoReply constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link EventInfoReply.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {U32} [data.eventData.event] EventID
	 * @param {Variable1} [data.eventData.creator] Creator
	 * @param {Variable1} [data.eventData.name] Name
	 * @param {Variable1} [data.eventData.category] Category
	 * @param {Variable2} [data.eventData.desc] Desc
	 * @param {Variable1} [data.eventData.date] Date
	 * @param {U32} [data.eventData.dateUTC] DateUTC
	 * @param {U32} [data.eventData.duration] Duration
	 * @param {U32} [data.eventData.cover] Cover
	 * @param {U32} [data.eventData.amount] Amount
	 * @param {Variable1} [data.eventData.simName] SimName
	 * @param {Vector3D} [data.eventData.globalPos] GlobalPos
	 * @param {U32} [data.eventData.eventFlags] EventFlags
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default EventInfoReply

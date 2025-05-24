import * as Types from "../types"
import Packet from "./packet"

/**
 * ChildAgentPositionUpdate Packet
 */
class ChildAgentPositionUpdate extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static override id = 27

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 */
	public static override frequency = 2

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
	public static override compression = false

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
					["regionHandle", Types.U64],
					["viewerCircuitCode", Types.U32],
					["agent", Types.UUID],
					["session", Types.UUID],
					["agentPos", Types.Vector3],
					["agentVel", Types.Vector3],
					["center", Types.Vector3],
					["size", Types.Vector3],
					["atAxis", Types.Vector3],
					["leftAxis", Types.Vector3],
					["upAxis", Types.Vector3],
					["changedGrid", Types.Boolean],
				]),
			},
		],
	])

	/**
	 * ChildAgentPositionUpdate constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ChildAgentPositionUpdate.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {U64} [data.agentData.regionHandle] RegionHandle
	 * @param {U32} [data.agentData.viewerCircuitCode] ViewerCircuitCode
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {Vector3} [data.agentData.agentPos] AgentPos
	 * @param {Vector3} [data.agentData.agentVel] AgentVel
	 * @param {Vector3} [data.agentData.center] Center
	 * @param {Vector3} [data.agentData.size] Size
	 * @param {Vector3} [data.agentData.atAxis] AtAxis
	 * @param {Vector3} [data.agentData.leftAxis] LeftAxis
	 * @param {Vector3} [data.agentData.upAxis] UpAxis
	 * @param {boolean} [data.agentData.changedGrid] ChangedGrid
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ChildAgentPositionUpdate

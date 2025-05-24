import * as Types from "../types"
import Packet from "./packet"

/**
 * SimulatorLoad Packet
 */
class SimulatorLoad extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static override id = 12

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
	public static override compression = false

	/**
	 * Determines the blocks that are are contained in the message and it's
	 * required parameters.
	 *
	 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
	 */
	public static override format: Map<string, any> = new Map([
		[
			"simulatorLoad",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["timeDilation", Types.F32],
					["agentCount", Types.S32],
					["canAcceptAgents", Types.Boolean],
				]),
			},
		],
		[
			"agentList",
			{
				parameters: new Map<string, any>([
					["circuitCode", Types.U32],
					["x", Types.U8],
					["y", Types.U8],
				]),
			},
		],
	])

	/**
	 * SimulatorLoad constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link SimulatorLoad.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {F32} [data.simulatorLoad.timeDilation] TimeDilation
	 * @param {S32} [data.simulatorLoad.agentCount] AgentCount
	 * @param {boolean} [data.simulatorLoad.canAcceptAgents] CanAcceptAgents
	 * @param {U32} [data.agentList.circuitCode] CircuitCode
	 * @param {U8} [data.agentList.x] X
	 * @param {U8} [data.agentList.y] Y
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default SimulatorLoad

import * as Types from "../types"
import Packet from "./packet"

/**
 * ObjectDuplicateOnRay Packet
 */
class ObjectDuplicateOnRay extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static override id = 91

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
	public static override trusted = false

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
			"agentData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["agent", Types.UUID],
					["session", Types.UUID],
					["group", Types.UUID],
					["rayStart", Types.Vector3],
					["rayEnd", Types.Vector3],
					["bypassRaycast", Types.Boolean],
					["rayEndIsIntersection", Types.Boolean],
					["copyCenters", Types.Boolean],
					["copyRotates", Types.Boolean],
					["rayTarget", Types.UUID],
					["duplicateFlags", Types.U32],
				]),
			},
		],
		[
			"objectData",
			{ parameters: new Map<string, any>([["objectLocal", Types.U32]]) },
		],
	])

	/**
	 * ObjectDuplicateOnRay constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ObjectDuplicateOnRay.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {string} [data.agentData.group] GroupID
	 * @param {Vector3} [data.agentData.rayStart] RayStart
	 * @param {Vector3} [data.agentData.rayEnd] RayEnd
	 * @param {boolean} [data.agentData.bypassRaycast] BypassRaycast
	 * @param {boolean} [data.agentData.rayEndIsIntersection] RayEndIsIntersection
	 * @param {boolean} [data.agentData.copyCenters] CopyCenters
	 * @param {boolean} [data.agentData.copyRotates] CopyRotates
	 * @param {string} [data.agentData.rayTarget] RayTargetID
	 * @param {U32} [data.agentData.duplicateFlags] DuplicateFlags
	 * @param {U32} [data.objectData.objectLocal] ObjectLocalID
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ObjectDuplicateOnRay

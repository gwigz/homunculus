import * as Types from "../types"
import Packet from "./packet"

/**
 * ObjectAdd Packet
 */
class ObjectAdd extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 1

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 */
	public static frequency = 1

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
	public static compression = true

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
					["group", Types.UUID],
				]),
			},
		],
		[
			"objectData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["pCode", Types.U8],
					["material", Types.U8],
					["addFlags", Types.U32],
					["pathCurve", Types.U8],
					["profileCurve", Types.U8],
					["pathBegin", Types.U16],
					["pathEnd", Types.U16],
					["pathScaleX", Types.U8],
					["pathScaleY", Types.U8],
					["pathShearX", Types.U8],
					["pathShearY", Types.U8],
					["pathTwist", Types.S8],
					["pathTwistBegin", Types.S8],
					["pathRadiusOffset", Types.S8],
					["pathTaperX", Types.S8],
					["pathTaperY", Types.S8],
					["pathRevolutions", Types.U8],
					["pathSkew", Types.S8],
					["profileBegin", Types.U16],
					["profileEnd", Types.U16],
					["profileHollow", Types.U16],
					["bypassRaycast", Types.U8],
					["rayStart", Types.Vector3],
					["rayEnd", Types.Vector3],
					["rayTarget", Types.UUID],
					["rayEndIsIntersection", Types.U8],
					["scale", Types.Vector3],
					["rotation", Types.Quaternion],
					["state", Types.U8],
				]),
			},
		],
	])

	/**
	 * ObjectAdd constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ObjectAdd.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {string} [data.agentData.group] GroupID
	 * @param {U8} [data.objectData.pCode] PCode
	 * @param {U8} [data.objectData.material] Material
	 * @param {U32} [data.objectData.addFlags] AddFlags
	 * @param {U8} [data.objectData.pathCurve] PathCurve
	 * @param {U8} [data.objectData.profileCurve] ProfileCurve
	 * @param {U16} [data.objectData.pathBegin] PathBegin
	 * @param {U16} [data.objectData.pathEnd] PathEnd
	 * @param {U8} [data.objectData.pathScaleX] PathScaleX
	 * @param {U8} [data.objectData.pathScaleY] PathScaleY
	 * @param {U8} [data.objectData.pathShearX] PathShearX
	 * @param {U8} [data.objectData.pathShearY] PathShearY
	 * @param {S8} [data.objectData.pathTwist] PathTwist
	 * @param {S8} [data.objectData.pathTwistBegin] PathTwistBegin
	 * @param {S8} [data.objectData.pathRadiusOffset] PathRadiusOffset
	 * @param {S8} [data.objectData.pathTaperX] PathTaperX
	 * @param {S8} [data.objectData.pathTaperY] PathTaperY
	 * @param {U8} [data.objectData.pathRevolutions] PathRevolutions
	 * @param {S8} [data.objectData.pathSkew] PathSkew
	 * @param {U16} [data.objectData.profileBegin] ProfileBegin
	 * @param {U16} [data.objectData.profileEnd] ProfileEnd
	 * @param {U16} [data.objectData.profileHollow] ProfileHollow
	 * @param {U8} [data.objectData.bypassRaycast] BypassRaycast
	 * @param {Vector3} [data.objectData.rayStart] RayStart
	 * @param {Vector3} [data.objectData.rayEnd] RayEnd
	 * @param {string} [data.objectData.rayTarget] RayTargetID
	 * @param {U8} [data.objectData.rayEndIsIntersection] RayEndIsIntersection
	 * @param {Vector3} [data.objectData.scale] Scale
	 * @param {Quaternion} [data.objectData.rotation] Rotation
	 * @param {U8} [data.objectData.state] State
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ObjectAdd

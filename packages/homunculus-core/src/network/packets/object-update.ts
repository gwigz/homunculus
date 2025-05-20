import Packet from "./packet"

import * as Types from "../types"

/**
 * ObjectUpdate Packet
 */
class ObjectUpdate extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 12

	/**
	 * Packet frequency. This value determines whether the message ID is 8, 16, or
	 * 32 bits. There can be unique 254 messages IDs in the "High" or "Medium"
	 * frequencies and 32,000 in "Low". A message with a "Fixed" frequency also
	 * defines its own ID and is considered to be a signal.
	 */
	public static frequency = 2

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
			"regionData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["regionHandle", Types.U64],
					["timeDilation", Types.U16],
				]),
			},
		],
		[
			"objectData",
			{
				parameters: new Map<string, any>([
					["id", Types.U32],
					["state", Types.U8],
					["uuid", Types.UUID],
					["crc", Types.U32],
					["pCode", Types.U8],
					["material", Types.U8],
					["clickAction", Types.U8],
					["scale", Types.Vector3],
					["objectData", Types.Variable1],
					["parent", Types.U32],
					["updateFlags", Types.U32],
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
					["textureEntry", Types.Variable2],
					["textureAnim", Types.Variable1],
					["nameValue", Types.Variable2],
					["data", Types.Variable2],
					["text", Types.Variable1],
					["textColor", Types.Fixed4],
					["mediaURL", Types.Variable1],
					["psBlock", Types.Variable1],
					["extraParams", Types.Variable1],
					["sound", Types.UUID],
					["owner", Types.UUID],
					["gain", Types.F32],
					["flags", Types.U8],
					["radius", Types.F32],
					["jointType", Types.U8],
					["jointPivot", Types.Vector3],
					["jointAxisOrAnchor", Types.Vector3],
				]),
			},
		],
	])

	/**
	 * ObjectUpdate constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link ObjectUpdate.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {U64} [data.regionData.regionHandle] RegionHandle
	 * @param {U16} [data.regionData.timeDilation] TimeDilation
	 * @param {U32} [data.objectData.id] ID
	 * @param {U8} [data.objectData.state] State
	 * @param {string} [data.objectData.uuid] FullID
	 * @param {U32} [data.objectData.crc] CRC
	 * @param {U8} [data.objectData.pCode] PCode
	 * @param {U8} [data.objectData.material] Material
	 * @param {U8} [data.objectData.clickAction] ClickAction
	 * @param {Vector3} [data.objectData.scale] Scale
	 * @param {Variable1} [data.objectData.objectData] ObjectData
	 * @param {U32} [data.objectData.parent] ParentID
	 * @param {U32} [data.objectData.updateFlags] UpdateFlags
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
	 * @param {Variable2} [data.objectData.textureEntry] TextureEntry
	 * @param {Variable1} [data.objectData.textureAnim] TextureAnim
	 * @param {Variable2} [data.objectData.nameValue] NameValue
	 * @param {Variable2} [data.objectData.data] Data
	 * @param {Variable1} [data.objectData.text] Text
	 * @param {Fixed4} [data.objectData.textColor] TextColor
	 * @param {Variable1} [data.objectData.mediaURL] MediaURL
	 * @param {Variable1} [data.objectData.psBlock] PSBlock
	 * @param {Variable1} [data.objectData.extraParams] ExtraParams
	 * @param {string} [data.objectData.sound] Sound
	 * @param {string} [data.objectData.owner] OwnerID
	 * @param {F32} [data.objectData.gain] Gain
	 * @param {U8} [data.objectData.flags] Flags
	 * @param {F32} [data.objectData.radius] Radius
	 * @param {U8} [data.objectData.jointType] JointType
	 * @param {Vector3} [data.objectData.jointPivot] JointPivot
	 * @param {Vector3} [data.objectData.jointAxisOrAnchor] JointAxisOrAnchor
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default ObjectUpdate

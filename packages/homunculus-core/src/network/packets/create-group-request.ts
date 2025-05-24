import * as Types from "../types"
import Packet from "./packet"

/**
 * CreateGroupRequest Packet
 */
class CreateGroupRequest extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static override id = 339

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
				]),
			},
		],
		[
			"groupData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["name", Types.Variable1],
					["charter", Types.Variable2],
					["showInList", Types.Boolean],
					["insignia", Types.UUID],
					["membershipFee", Types.S32],
					["openEnrollment", Types.Boolean],
					["allowPublish", Types.Boolean],
					["maturePublish", Types.Boolean],
				]),
			},
		],
	])

	/**
	 * CreateGroupRequest constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link CreateGroupRequest.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be serialized, may be optional
	 * @param {string} [data.agentData.agent] AgentID
	 * @param {string} [data.agentData.session] SessionID
	 * @param {Variable1} [data.groupData.name] Name
	 * @param {Variable2} [data.groupData.charter] Charter
	 * @param {boolean} [data.groupData.showInList] ShowInList
	 * @param {string} [data.groupData.insignia] InsigniaID
	 * @param {S32} [data.groupData.membershipFee] MembershipFee
	 * @param {boolean} [data.groupData.openEnrollment] OpenEnrollment
	 * @param {boolean} [data.groupData.allowPublish] AllowPublish
	 * @param {boolean} [data.groupData.maturePublish] MaturePublish
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default CreateGroupRequest

import * as Types from "../types"
import Packet from "./packet"

/**
 * UserReportInternal Packet
 */
class UserReportInternal extends Packet {
	/**
	 * Packet ID, this value is only unique per-frequency range, see key get
	 * method of Packet, plus the buffer helper of the network namespace for
	 * generating a lookup codes.
	 */
	public static id = 21

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
			"reportData",
			{
				quantity: 1,
				parameters: new Map<string, any>([
					["reportType", Types.U8],
					["category", Types.U8],
					["reporter", Types.UUID],
					["viewerPosition", Types.Vector3],
					["agentPosition", Types.Vector3],
					["screenshot", Types.UUID],
					["object", Types.UUID],
					["owner", Types.UUID],
					["lastOwner", Types.UUID],
					["creator", Types.UUID],
					["region", Types.UUID],
					["abuser", Types.UUID],
					["abuseRegionName", Types.Variable1],
					["abuseRegion", Types.UUID],
					["summary", Types.Variable1],
					["details", Types.Variable2],
					["versionString", Types.Variable1],
				]),
			},
		],
	])

	/**
	 * UserReportInternal constructor, can be passed either a fully
	 * initialized Packet Buffer or an object containing this Objects required
	 * parameters from {@link UserReportInternal.format}. Note that
	 * "agentData" blocks may be excluded if {@link build} is able to fetch the
	 * requirements itself.
	 *
	 * @param {object|Buffer} [data] Packet block data to be seralized, may be optional
	 * @param {U8} [data.reportData.reportType] ReportType
	 * @param {U8} [data.reportData.category] Category
	 * @param {string} [data.reportData.reporter] ReporterID
	 * @param {Vector3} [data.reportData.viewerPosition] ViewerPosition
	 * @param {Vector3} [data.reportData.agentPosition] AgentPosition
	 * @param {string} [data.reportData.screenshot] ScreenshotID
	 * @param {string} [data.reportData.object] ObjectID
	 * @param {string} [data.reportData.owner] OwnerID
	 * @param {string} [data.reportData.lastOwner] LastOwnerID
	 * @param {string} [data.reportData.creator] CreatorID
	 * @param {string} [data.reportData.region] RegionID
	 * @param {string} [data.reportData.abuser] AbuserID
	 * @param {Variable1} [data.reportData.abuseRegionName] AbuseRegionName
	 * @param {string} [data.reportData.abuseRegion] AbuseRegionID
	 * @param {Variable1} [data.reportData.summary] Summary
	 * @param {Variable2} [data.reportData.details] Details
	 * @param {Variable1} [data.reportData.versionString] VersionString
	 */
	constructor(data = {}) {
		super(data)
	}
}

export default UserReportInternal

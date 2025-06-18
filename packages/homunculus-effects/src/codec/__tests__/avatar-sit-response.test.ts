import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import * as AvatarSitResponse from "~/codec/generated/packets/avatar-sit-response"
import * as PacketDecoder from "~/codec/lludp/packet-decoder"
import { Quaternion, type UUID, Vector3 } from "~/model/types"

/**
 * Base `AvatarSitResponse` packet.
 *
 * | Bytes           | Description                                                    |
 * | --------------- | -------------------------------------------------------------- |
 * | `0xc0`          | `ZEROCODED` and `RELIABLE` flags                                |
 * | `0x00001338`    | Sequence (4920)                                                |
 * | `0x0015`        | Message ID (AvatarSitResponse, High-frequency)                 |
 * | `0x3d1d...3622` | Sit Object ID (`3d1d2450-1c95-f483-d762-776c9afa3622`)         |
 * | `0x01`          | Sit Transform Auto-Pilot (true)                                |
 * | ...             | Remaining packet body, bit hard to describe as it's zero-coded |
 */
const PACKET_BUFFER = Buffer.from(
	"c00000133800153d1d24501c95f483d762776c9afa362201643b5fbe0a022b3e560e2d3e0003800003802313633f0019",
	"hex",
)

/**
 * Uncompressed `AvatarSitResponse` packet body.
 *
 * | Field            | Value                                                             |
 * | ---------------- | ----------------------------------------------------------------- |
 * | **SitObject**    |                                                                   |
 * | ID               | `3d1d2450-1c95-f483-d762-776c9afa3622`                            |
 * | **SitTransform** |                                                                   |
 * | AutoPilot        | `true`                                                            |
 * | SitPosition      | `<-0.21799999475479126, 0.1669999659061432, 0.16899999976158142>` |
 * | SitRotation      | `<-0.0, -0.0, 0.8870107531547546, 0.46174876695865136>`           |
 * | CameraEyeOffset  | `<0.0, 0.0, 0.0>`                                                 |
 * | CameraAtOffset   | `<0.0, 0.0, 0.0>`                                                 |
 * | ForceMouselook   | `0`                                                               |
 */
const PACKET_BUFFER_UNCOMPRESSED = PacketDecoder.uncompress(PACKET_BUFFER)

describe("AvatarSitResponse", () => {
	it("decodes the packet body", () => {
		const data = AvatarSitResponse.decode(PACKET_BUFFER_UNCOMPRESSED)

		expect(data).toEqual({
			sitObject: {
				id: "3d1d2450-1c95-f483-d762-776c9afa3622" as UUID,
			},
			sitTransform: {
				autoPilot: true,
				sitPosition: Vector3({
					x: -0.21799999475479126,
					y: 0.1669999659061432,
					z: 0.16899999976158142,
				}),
				sitRotation: Quaternion({
					x: -0.0,
					y: -0.0,
					z: 0.8870107531547546,
					w: 0.46174876695865136,
				}),
				cameraEyeOffset: Vector3({ x: 0.0, y: 0.0, z: 0.0 }),
				cameraAtOffset: Vector3({ x: 0.0, y: 0.0, z: 0.0 }),
				forceMouselook: false,
			},
		})
	})

	it("encodes the packet correctly (round-trip)", () => {
		const originalData = {
			sitObject: {
				id: "3d1d2450-1c95-f483-d762-776c9afa3622" as UUID,
			},
			sitTransform: {
				autoPilot: true,
				sitPosition: Vector3({
					x: -0.21799999475479126,
					y: 0.1669999659061432,
					z: 0.16899999976158142,
				}),
				sitRotation: Quaternion({
					x: -0.0,
					y: -0.0,
					z: 0.8870107531547546,
					w: 0.46174876695865136,
				}),
				cameraEyeOffset: Vector3({ x: 0.0, y: 0.0, z: 0.0 }),
				cameraAtOffset: Vector3({ x: 0.0, y: 0.0, z: 0.0 }),
				forceMouselook: false,
			},
		}

		const encoded = AvatarSitResponse.encode(4920, true, originalData)
		const decoded = AvatarSitResponse.decode(encoded)

		expect(decoded).toEqual(originalData)
		expect(encoded).toEqual(PACKET_BUFFER_UNCOMPRESSED)
	})
})

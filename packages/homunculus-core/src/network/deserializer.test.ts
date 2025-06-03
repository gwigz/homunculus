import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import type { AvatarSitResponseData, Packet } from "~/network"
import { Deserializer } from "./deserializer"

const avatarSitResponse = [
	// header (6 bytes)
	"c0", // flags: reliable, zero-coded
	"00 00 0c 11", // sequence number: 3089
	"00", // extra header length: 0

	// message number (1 byte, high frequency message)
	"15", // 21 (AvatarSitResponse)

	// Id (LLUUID, 16 bytes)
	"3d 53 94 51 8a 41 c0 85 4a bb af e4 51 6c c1 11",

	// AutoPilot (BOOL, 1 byte)
	"01", // TRUE

	// SitPosition (LLVector3, 12 bytes, zero-coded to 6 bytes)
	"00 08" /* 00 00 00 00 */,
	/* 00 00 00 00 */
	"9a 73 7a 3f",

	// SitRotation (LLQuaternion, 12 bytes, zero-coded to 10 bytes)
	"00 03 80" /* 00 00 00 08 */,
	"00 03 80" /* 00 00 00 08 */,
	"68 40 78 bf",

	// CameraEyeOffset (LLVector3, 12 bytes, zero-coded to 8 bytes)
	"00 02 40 c0" /* 00 00 40 c0 */,
	"00 06" /* 00 00 00 00 */,
	"80 3f" /* 00 00 80 3f */,

	// CameraAtOffset (LLVector3, 12 bytes, zero-coded to 8 bytes)
	"00 02 80 40",
	"00 06" /* 00 00 00 00 */,
	"80 3f" /* 00 00 80 3f */,

	// ForceMouselook (BOOL, 1 byte, zero-coded to 2 bytes)
	"00 01" /* 00 */, // FALSE
]

describe("Deserializer", () => {
	const deserializer = new Deserializer()

	describe("AvatarSitResponse", () => {
		it("deserializes AvatarSitResponse packet correctly", () => {
			const packetBuffer = deserializer.read(
				Buffer.from(
					avatarSitResponse
						.join(" ")
						.split(" ")
						.map((hex) => Number.parseInt(hex, 16)),
				),
			)

			expect(packetBuffer?.id).toBe(21)
			expect(packetBuffer?.frequency).toBe(0) // high frequency
			expect(packetBuffer?.zerocoded).toBe(true)
			expect(packetBuffer?.acks).toBe(false)

			const metadata = deserializer.lookup(packetBuffer)

			expect(metadata?.name).toBe("AvatarSitResponse")

			const result = deserializer.convert(metadata!, packetBuffer)

			expect(result.sequence).toBe(0x0c11)

			const data = (result as Packet<AvatarSitResponseData>).data

			expect(data.sitObject?.id).toBe("3d539451-8a41-c085-4abb-afe4516cc111")

			expect(data.sitTransform?.autoPilot).toBe(true)

			expect(data.sitTransform?.sitPosition.toString()).toEqual(
				"<0.9783264398574829, 0, 0>",
			)

			expect(data.sitTransform?.sitRotation.toString()).toEqual("<0, 0, 0, 1>")
			expect(data.sitTransform?.cameraEyeOffset.toString()).toEqual("<0, 0, 0>")
			expect(data.sitTransform?.cameraAtOffset.toString()).toEqual("<0, 0, 0>")
			expect(data.sitTransform?.forceMouselook).toBe(false)
		})
	})
})

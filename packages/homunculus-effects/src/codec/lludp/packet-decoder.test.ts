import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import * as PacketDecoder from "~/codec/lludp/packet-decoder"

describe("PacketDecoder", () => {
	describe("decodeHeader", () => {
		// TODO: this is not zero-coded
		it("decodes high-frequency, zerocoded, reliable packet header", () => {
			// IN AvatarSitResponse [ZEROCODED] [RELIABLE]
			// # ID: 4920

			// [SitObject]
			//   ID = 3d1d2450-1c95-f483-d762-776c9afa3622
			// [SitTransform]
			//   AutoPilot = 1
			//   SitPosition = <-0.21799999475479126, 0.1669999659061432, 0.16899999976158142>
			//   SitRotation = <-0.0, -0.0, 0.8870107531547546, 0.46174876695865136>
			//   CameraEyeOffset = <0.0, 0.0, 0.0>
			//   CameraAtOffset = <0.0, 0.0, 0.0>
			//   ForceMouselook = 0

			const buffer = Buffer.from(
				"c00000133800153d1d24501c95f483d762776c9afa362201643b5fbe0a022b3e560e2d3e0003800003802313633f0019",
				"hex",
			)

			const header = PacketDecoder.decodeHeader(buffer)

			expect(header).toEqual(
				expect.objectContaining({
					reliable: true,
					sequence: 4920,
					frequency: 0,
					id: 21,
				}),
			)
		})

		it("decodes low-frequency, reliable packet header with one ACK", () => {
			// IN RegionIDAndHandleReply [RELIABLE] [ACK]
			// # ID: 72

			// [ReplyBlock]
			//   RegionID = c75f4942-9e43-4aa3-9b7d-4072b3a3aee3
			//   RegionHandle = 775155697873664

			const buffer = Buffer.from(
				"500000004800ffff0136c75f49429e434aa39b7d4072b3a3aee30073040000c102000000000f01",
				"hex",
			)

			const header = PacketDecoder.decodeHeader(buffer)

			expect(header).toEqual(
				expect.objectContaining({
					reliable: true,
					sequence: 72,
					frequency: 2,
					id: 310,
				}),
			)
		})

		it("decodes high-frequency, unreliable packet header with multiple ACKs", () => {
			// OUT CompletePingCheck [ACK]
			// # ID: 11941

			// [PingID]
			//   PingID = 179

			const buffer = Buffer.from(
				// 0xb3 (pingId) -> 0x00009f4b, 0x00009f4c, 0x00009f4e, 0x03 (3 acks)
				"1000002ea50002b300009f4b00009f4c00009f4e03",
				"hex",
			)

			const header = PacketDecoder.decodeHeader(buffer)

			expect(header).toEqual(
				expect.objectContaining({
					reliable: false,
					sequence: 11941,
					frequency: 0,
					id: 2,
				}),
			)
		})
	})

	describe("decodeAppendedAcks", () => {
		it("decodes appended acks", () => {
			const buffer = Buffer.from(
				// 0xb3 (pingId) -> 0x00009f4b, 0x00009f4c, 0x00009f4e, 0x03 (3 acks)
				"1000002ea50002b300009f4b00009f4c00009f4e03",
				"hex",
			)

			const acks = PacketDecoder.decodeAppendedAcks(buffer)

			expect(acks).toEqual([40779, 40780, 40782])
		})
	})
})

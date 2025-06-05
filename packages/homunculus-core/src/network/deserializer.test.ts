import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import { Quaternion, Vector3 } from "~/network"
import { Deserializer } from "./deserializer"

describe("Deserializer", () => {
	const deserializer = new Deserializer()

	it("deserializes zero-coded packet correctly", () => {
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

		const expectedResult = {
			metadata: {
				name: "AvatarSitResponse",
				id: 21,
				trusted: true,
				compression: true,
			},
			sequence: 4920,
			reliable: true,
			data: {
				sitObject: { id: "3d1d2450-1c95-f483-d762-776c9afa3622" },
				sitTransform: {
					autoPilot: true,
					sitPosition: new Vector3(
						-0.21799999475479126,
						0.1669999659061432,
						0.16899999976158142,
					),
					sitRotation: new Quaternion(
						-0,
						-0,
						0.8870107531547546,
						0.46174876695865136,
					),
					cameraEyeOffset: new Vector3(0, 0, 0),
					cameraAtOffset: new Vector3(0, 0, 0),
					forceMouselook: false,
				},
			},
		} as const

		const packetBuffer = deserializer.read(
			Buffer.from(
				// this buffer was captured via. hippolyzer
				"c00000133800153d1d24501c95f483d762776c9afa362201643b5fbe0a022b3e560e2d3e0003800003802313633f0019",
				"hex",
			),
		)

		expect(packetBuffer?.frequency).toBe(0) // high frequency
		expect(packetBuffer?.zerocoded).toBe(true)
		expect(packetBuffer?.acks).toBe(false)

		const metadata = deserializer.lookup(packetBuffer)
		const result = deserializer.convert(metadata!, packetBuffer)

		expect(result).toEqual({
			...expectedResult,
			metadata: { ...result.metadata, ...expectedResult.metadata },
		})

		expect(packetBuffer?.acknowledgements()).toEqual([])
	})

	it("deserializes packet with bigint and appended ack correctly", () => {
		// IN RegionIDAndHandleReply [RELIABLE] [ACK]
		// # ID: 72

		// [ReplyBlock]
		//   RegionID = c75f4942-9e43-4aa3-9b7d-4072b3a3aee3
		//   RegionHandle = 775155697873664

		const expectedResult = {
			metadata: {
				name: "RegionIDAndHandleReply",
				frequency: 2,
				id: 310,
				trusted: true,
			},
			sequence: 72,
			reliable: true,
			data: {
				replyBlock: {
					regionId: "c75f4942-9e43-4aa3-9b7d-4072b3a3aee3",
					regionHandle: 775155697873664n,
				},
			},
		} as const

		const packetBuffer = deserializer.read(
			Buffer.from(
				// this buffer was captured via. hippolyzer
				"500000004800ffff0136c75f49429e434aa39b7d4072b3a3aee30073040000c102000000000f01",
				"hex",
			),
		)

		expect(packetBuffer?.frequency).toBe(2) // low frequency
		expect(packetBuffer?.zerocoded).toBe(false)
		expect(packetBuffer?.acks).toBe(true)

		const metadata = deserializer.lookup(packetBuffer)
		const result = deserializer.convert(metadata!, packetBuffer)

		expect(result).toEqual({
			...expectedResult,
			metadata: { ...result.metadata, ...expectedResult.metadata },
		})

		expect(packetBuffer?.acknowledgements()).toEqual([0x0000000f])
	})

	it("deserializes complex zero-coded packet correctly", () => {
		// OUT RezMultipleAttachmentsFromInv [ZEROCODED] [RELIABLE]
		// # ID: 41

		// [AgentData]
		//   AgentID = 2af0619d-077d-4700-999d-fe9cde93ced8
		//   SessionID = aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
		// [HeaderData]
		//   CompoundMsgID = fb10b34d-e17a-5a7d-bb9e-646f09b1d8e7
		//   TotalObjects = 1
		//   FirstDetachAll = 0
		// [ObjectData]
		//   ItemID = e6dfb79b-565d-c74b-74fc-d1e423f7735e
		//   OwnerID = 2af0619d-077d-4700-999d-fe9cde93ced8
		//   AttachmentPt = 128
		//   ItemFlags =| () #0x0
		//   GroupMask =| () #0x0
		//   EveryoneMask =| () #0x0
		//   NextOwnerMask =| ('MODIFY', 'COPY', 'MOVE') #0x8c000
		//   Name = 'REBORN by eBODY v1.69.4'
		//   Description = '(No Description)'

		const expectedResult = {
			metadata: {
				name: "RezMultipleAttachmentsFromInv",
				id: 396,
				compression: true,
			},
			sequence: 41,
			reliable: true,
			data: {
				agentData: {
					agentId: "2af0619d-077d-4700-999d-fe9cde93ced8",
					sessionId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
				},
				headerData: {
					compoundMsgId: "fb10b34d-e17a-5a7d-bb9e-646f09b1d8e7",
					totalObjects: 1,
					firstDetachAll: false,
				},
				objectData: [
					{
						itemId: "e6dfb79b-565d-c74b-74fc-d1e423f7735e",
						ownerId: "2af0619d-077d-4700-999d-fe9cde93ced8",
						attachmentPt: 128,
						itemFlags: 0,
						groupMask: 0,
						everyoneMask: 0,
						nextOwnerMask: 0x8c000, // MODIFY, COPY, MOVE
						name: Buffer.from("REBORN by eBODY v1.69.4\0", "utf-8"),
						description: Buffer.from("(No Description)\0", "utf-8"),
					},
				],
			},
		} as const

		const packetBuffer = deserializer.read(
			Buffer.from(
				"c00000002900ffff018c2af0619d077d470001999dfe9cde93ced8aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafb10b34de17a5a7dbb9e646f09b1d8e701000101e6dfb79b565dc74b74fcd1e423f7735e2af0619d077d470001999dfe9cde93ced880000dc0080001185245424f524e2062792065424f44592076312e36392e34000111284e6f204465736372697074696f6e290001",
				"hex",
			),
		)

		expect(packetBuffer?.frequency).toBe(2) // low frequency
		expect(packetBuffer?.zerocoded).toBe(true)
		expect(packetBuffer?.acks).toBe(false)

		const metadata = deserializer.lookup(packetBuffer)
		const result = deserializer.convert(metadata!, packetBuffer)

		expect(result).toEqual({
			...expectedResult,
			metadata: { ...result.metadata, ...expectedResult.metadata },
		})

		expect(packetBuffer?.acknowledgements()).toEqual([])
	})

	it("deserializes packet with multiple appended acks correctly", () => {
		// OUT CompletePingCheck [ACK]
		// # ID: 11941

		// [PingID]
		//   PingID = 179

		const expectedResult = {
			metadata: { name: "CompletePingCheck", id: 2 },
			sequence: 11941,
			data: { pingId: { pingId: 179 } },
		} as const

		const packetBuffer = deserializer.read(
			// 0xb3 (pingId) -> 0x00009f4b, 0x00009f4c, 0x00009f4e, 0x03 (3 acks)
			Buffer.from("1000002ea50002b300009f4b00009f4c00009f4e03", "hex"),
		)

		expect(packetBuffer?.frequency).toBe(0) // high frequency
		expect(packetBuffer?.zerocoded).toBe(false)
		expect(packetBuffer?.acks).toBe(true)

		const metadata = deserializer.lookup(packetBuffer)
		const result = deserializer.convert(metadata!, packetBuffer)

		expect(result).toEqual({
			...expectedResult,
			metadata: { ...result.metadata, ...expectedResult.metadata },
		})

		const acks = packetBuffer?.acknowledgements()

		expect(acks).toEqual([0x00009f4b, 0x00009f4c, 0x00009f4e])
	})
})

import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import {
	type ImprovedTerseObjectUpdateData,
	type ObjectUpdateData,
	PacketBuffer,
	Quaternion,
	U32,
	Vector3,
} from "~/network"
import type { EntityOptions } from "~/structures"
import { updateEntityFromTerseObjectUpdate } from "./delegates/improved-terse-object-update-delegate"
import { updateEntityFromObjectData } from "./delegates/object-update-delegate"
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

		expect(packetBuffer?.id).toBe(expectedResult.metadata.id)
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

		expect(packetBuffer?.id).toBe(expectedResult.metadata.id)
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

		expect(packetBuffer?.id).toBe(expectedResult.metadata.id)
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

		expect(packetBuffer?.id).toBe(expectedResult.metadata.id)
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

	it("deserializes region handshake packet correctly", () => {
		// IN RegionHandshake [ZEROCODED] [RELIABLE]
		// # ID: 3

		// [RegionInfo]
		//   RegionFlags =| ('ALLOW_DAMAGE', \
		//      'ALLOW_LANDMARK', \
		//      'ALLOW_SET_HOME', \
		//      'ALLOW_ACCESS_OVERRIDE', \
		//      'BLOCK_LAND_RESELL', \
		//      'ALLOW_DIRECT_TELEPORT', \
		//      'ALLOW_PARCEL_CHANGES', \
		//      'ALLOW_VOICE', \
		//      'BLOCK_PARCEL_SEARCH') #0x341000a7
		//   SimAccess = 21
		//   SimName = 'Touhou'
		//   SimOwner = 07ae2f69-8a68-4e7a-9abf-d45b32584542
		//   IsEstateManager = 0
		//   WaterHeight = 20.0
		//   BillableFactor = 0.0
		//   CacheID = 005d253d-8799-52bc-9f88-b8e228a11d73
		//   ...
		// [RegionInfo2]
		//   RegionID = 16a81d1f-1aa7-43c6-9681-f8f1775e614e
		// [RegionInfo3]
		//   CPUClassID = 960
		//   CPURatio = 1
		//   ColoName = 'aws-us-west-2a'
		//   ProductSKU = b'624\x00'
		//   ProductName = 'Estate / Full Region 30k'
		// [RegionInfo4]
		//   RegionFlagsExtended =| ('ALLOW_DAMAGE', \
		//      'ALLOW_LANDMARK', \
		//      'ALLOW_SET_HOME', \
		//      'ALLOW_ACCESS_OVERRIDE', \
		//      'BLOCK_LAND_RESELL', \
		//      'ALLOW_DIRECT_TELEPORT', \
		//      'ALLOW_PARCEL_CHANGES', \
		//      'ALLOW_VOICE', \
		//      'BLOCK_PARCEL_SEARCH') #0x341000a7
		//   RegionProtocols = 1

		const packetBuffer = deserializer.read(
			Buffer.from(
				"c00000000300ffff000194a7000110341507546f75686f75000107ae2f698a684e7a9abfd45b325845420003a04100055d253d879952bc9f88b8e228a11d739c434a43d5d8a3ddb624416782383478abb783e63e9326c0248a247666855da3179cdabd398a9b6b13914dc333ba321fbeb169c711eafff2efe50f24dc881df2d381a667426d672785afbf4d6b2c6b2f7ae344b75cb0c25f98085e18b0243690ca0001418ad4f3d6c7a0dd7d9ec28ae69b9f5e432fcb135b54c4b805f8c54c494b0002e0400002184100029c41000280400002f04100020c420002f0410002344216a81d1f1aa743c69681f8f1775e614ec00300020100030f6177732d75732d776573742d3261000104363234000119457374617465202f2046756c6c20526567696f6e2033306b000101a7000110340004010007",
				"hex",
			),
		)

		expect(packetBuffer?.id).toBe(148)
		expect(packetBuffer?.frequency).toBe(2) // low frequency
		expect(packetBuffer?.zerocoded).toBe(true)
		expect(packetBuffer?.acks).toBe(false)

		const metadata = deserializer.lookup(packetBuffer)
		const result = deserializer.convert(metadata!, packetBuffer)

		expect(result.data?.regionInfo?.simName).toBeInstanceOf(Buffer)

		expect(
			result.data?.regionInfo?.simName.toString("utf-8").slice(0, -1),
		).toBe("Touhou")

		expect(packetBuffer?.acknowledgements()).toEqual([])
	})

	it("handles improved terse object avatar update packet correctly", () => {
		// IN ImprovedTerseObjectUpdate [RELIABLE]
		// # ID: 4564

		// [RegionData]
		// 	RegionHandle = 586039697946880
		// 	TimeDilation =| 1.0 #65535
		// [ObjectData]
		// 	Data =| {'ID': 95620042, \
		// 		 'State': 0, \
		// 		 'FootCollisionPlane': (0.0, 0.0, 0.9999999403953552, 3673.584716796875), \
		// 		 'Position': (116.16954040527344, 73.03228759765625, 3674.511962890625), \
		// 		 'Velocity': (3.080125123979542, 0.8613412680247166, -0.0), \
		// 		 'Acceleration': (-0.0, -0.0, -0.0), \
		// 		 'Rotation': (-0.0, -0.0, 0.9841916533150226, -0.17698939497978183), \
		// 		 'AngularVelocity': (-0.0, -0.0, 0.23340199893186764)}
		// 	#Data = b'\xca\x0b\xb3\x05\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\xff\xff\x7f?[\x99eE\xceV\xe8B\x88\x10\x92B1\xa8eE\x14\x83\xdc\x80\xff\x7f\xff\x7f\xff\x7f\xff\x7f\xff\x7f\xff\x7f\xf9\xfdXi\xff\x7f\xff\x7fw\x80'
		// 	TextureEntry =| None
		// 	#TextureEntry = b''

		const expectedResult = {
			acceleration: "<0, 0, 0>",
			angularVelocity: "<0, 0, 0.23340199893186764>",
			position: "<116.16954040527344, 73.03228759765625, 3674.511962890625>",
			rotation: "<0, 0, 0.9841916533150226, -0.17698939497978183>",
			state: 0,
			velocity: "<3.080125123979542, 0.8613412680247166, 0>",
		}

		const packetBuffer = deserializer.read(
			Buffer.from(
				"40000011d4000f0039050000150200ffff013cca0bb30500010000000000000000ffff7f3f5b996545ce56e8428810924231a865451483dc80ff7fff7fff7fff7fff7fff7ff9fd5869ff7fff7f77800000",
				"hex",
			),
		)

		expect(packetBuffer?.id).toBe(15)
		expect(packetBuffer?.frequency).toBe(0) // high frequency
		expect(packetBuffer?.zerocoded).toBe(false)
		expect(packetBuffer?.acks).toBe(false)
		expect(packetBuffer?.sequence).toBe(4564)

		const metadata = deserializer.lookup(packetBuffer)
		const result = deserializer.convert(metadata!, packetBuffer)
		const data = result.data as ImprovedTerseObjectUpdateData

		expect(data.regionData).toEqual({
			regionHandle: 586039697946880n,
			timeDilation: 65535, // not sure why we don't parse this as 1.0
		})

		expect(data.objectData).toHaveLength(1)

		const object = data.objectData![0]!
		const buffer = new PacketBuffer(object.data as Buffer, true)
		const entity = {} as EntityOptions

		expect(buffer.length).toBe(60)
		expect(buffer.read(U32)).toBe(95620042)

		updateEntityFromTerseObjectUpdate(entity, buffer)

		expect({
			...entity,
			acceleration: entity.acceleration?.toString(),
			angularVelocity: entity.angularVelocity?.toString(),
			position: entity.position?.toString(),
			rotation: entity.rotation?.toString(),
			velocity: entity.velocity?.toString(),
		}).toEqual(expectedResult as any)
	})

	it.skip("handles multiple object update packets correctly", () => {
		const packetBuffer = deserializer.read(
			Buffer.from(
				"c00000003f000c00013905000215020001eefe02f33db305000122bd29db1de24bd9a921ab8fb956d802e3440100012f0400016666e63e9a99193f6ad6cd3f4c0008ffff7f3f5b9965453868e542cb248f42d2a7654500206f514cbf0007809c77af35000411080210100100046464000f1d0176bf1429475fd1228a32b52716b43e998280808080800001b3bff128d2309900016a02a7a3dcd22c3681808080808000015f458aa221d8da971a7ba7d895d8b41fc080808080000167c4b118682fa03ac7494ce42a46cb32a0808080800001ef4ada140f0a80392fb30fd25f9690bd9fffff9fe17f0010c0800001d2bfda8d6e9dce8ad4d4fc62c8260c61a0800001c228d1cf4b5d4ba884f4899a0796aa979000012a683c68e0bc261041f6639d5e086d29880001d5da5c9157c3a96a18ade1d736ee1814840001913434e72e48ee61a61be062ec4f11538200010580d77d136a7f913e8a8d3323628a860008803f0003803f0021810001446973706c61794e616d6520535452494e472052572044532047726173732045617465720a46697273744e616d6520535452494e472052572044532050616e63616b650a4c6173744e616d6520535452494e4720525720445320576166666c650a5469746c6520535452494e47205257204453207b4b7d205265736964656e74000a0100431631b305000107ae2f698a684e7a9abfd45b325845427ae00500012f0400016666e63e9a99193fb101b83f4c0008ffff7f3f5b9965454813e64213ff8d4275a665450020aeed4c3f0008a07f4e03000411080210100100046464000f1d01a8bacc46a167f6d4814e8f905b867b328280808080800001e69d4386d8724c1d8ca88064358696608180808080800001684371249d2eda5988fbbf2c36cdec19c08080808000018b896cf76bdcc6d8bcbf6986cb337cafa0808080800001d3773bed4ea3c545db7723ba70157b949fffff9fe17f0010c0800001a4716c93ba8686ad9000016061951fdb0ba0800001c228d1cf4b5d4ba884f4899a0796aa9790000118f8cabda423c1d7d6a37886af397196880001897dc6058b53cad58724ec23fe9d37d2840001460e3c9465746ed6171dd688922ef4618200015a9446c67f9783a6c3ba3d5c473c6afa0008803f0003803f0021680001446973706c61794e616d6520535452494e47205257204453204b6974616b6120466f6568616d6d65720a46697273744e616d6520535452494e47205257204453204b6974616b610a4c6173744e616d6520535452494e4720525720445320466f6568616d6d6572000a010043",
				"hex",
			),
		)

		expect(packetBuffer?.id).toBe(12)
		expect(packetBuffer?.frequency).toBe(0) // high frequency
		expect(packetBuffer?.zerocoded).toBe(true)
		expect(packetBuffer?.acks).toBe(false)
		expect(packetBuffer?.sequence).toBe(63)

		const metadata = deserializer.lookup(packetBuffer)
		const result = deserializer.convert(metadata!, packetBuffer)
		const data = result.data as ObjectUpdateData

		expect(data.objectData).toHaveLength(2)

		for (const object of data.objectData!) {
			const entity = {} as EntityOptions

			updateEntityFromObjectData(
				entity,
				new PacketBuffer(object.objectData as Buffer, true),
			)

			console.log(entity)
		}
	})
})

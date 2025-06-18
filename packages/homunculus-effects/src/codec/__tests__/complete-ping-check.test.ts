import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import * as CompletePingCheck from "~/codec/generated/packets/complete-ping-check"

/**
 * Base `CompletePingCheck` packet with three appended ACKs.
 *
 * | Bytes        | Description                                    |
 * | ------------ | ---------------------------------------------- |
 * | `0x10`       | ACK flag                                        |
 * | `0x00002ea5` | Sequence (11941)                               |
 * | `0x00`       | Extra header bytes (0)                         |
 * | `0x02`       | Message ID (CompletePingCheck, High-frequency) |
 * | `0xb3`       | Ping ID (179)                                  |
 * | `0x00009f4b` | ACK #1                                         |
 * | `0x00009f4c` | ACK #2                                         |
 * | `0x00009f4e` | ACK #3                                         |
 * | `0x03`       | ACK count (3)                                  |
 */
const PACKET_BUFFER = Buffer.from(
	"1000002ea50002b300009f4b00009f4c00009f4e03",
	"hex",
)

const PACKET_BUFFER_WITHOUT_ACKS = Buffer.from("0000002ea50002b3", "hex")

describe("CompletePingCheck packet", () => {
	it("decodes the packet body", () => {
		const data = CompletePingCheck.decode(PACKET_BUFFER)

		expect(data).toEqual({
			pingId: {
				pingId: 179,
			},
		})
	})

	it("encodes the packet correctly (round-trip)", () => {
		const originalData = {
			pingId: {
				pingId: 179,
			},
		}

		const encoded = CompletePingCheck.encode(11941, false, originalData)
		const decoded = CompletePingCheck.decode(encoded)

		expect(decoded).toEqual(originalData)
		expect(encoded).toEqual(PACKET_BUFFER_WITHOUT_ACKS)
	})
})

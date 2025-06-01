import { Buffer } from "node:buffer"
import { describe, expect, it } from "bun:test"
import IP from "./ip"

describe("IP", () => {
	describe("size", () => {
		it("has correct size", () => {
			expect(IP.size).toBe(4)
		})
	})

	describe("buffer serialization", () => {
		it("converts valid IP address to buffer", () => {
			const ip = "192.168.1.1"
			const buffer = IP.toBuffer(ip)

			expect(buffer.length).toBe(IP.size)
			expect(buffer.readUInt8(0)).toBe(192)
			expect(buffer.readUInt8(1)).toBe(168)
			expect(buffer.readUInt8(2)).toBe(1)
			expect(buffer.readUInt8(3)).toBe(1)
		})

		it("handles missing octets", () => {
			const ip = "192.168"
			const buffer = IP.toBuffer(ip)

			expect(buffer.length).toBe(IP.size)
			expect(buffer.readUInt8(0)).toBe(192)
			expect(buffer.readUInt8(1)).toBe(168)
			expect(buffer.readUInt8(2)).toBe(0)
			expect(buffer.readUInt8(3)).toBe(0)
		})

		it("handles invalid octets", () => {
			const ip = "192.168.invalid.1"
			const buffer = IP.toBuffer(ip)

			expect(buffer.length).toBe(IP.size)
			expect(buffer.readUInt8(0)).toBe(192)
			expect(buffer.readUInt8(1)).toBe(168)
			expect(buffer.readUInt8(2)).toBe(0)
			expect(buffer.readUInt8(3)).toBe(1)
		})

		it("handles empty string", () => {
			const ip = ""
			const buffer = IP.toBuffer(ip)

			expect(buffer.length).toBe(IP.size)
			expect(buffer.readUInt8(0)).toBe(0)
			expect(buffer.readUInt8(1)).toBe(0)
			expect(buffer.readUInt8(2)).toBe(0)
			expect(buffer.readUInt8(3)).toBe(0)
		})
	})

	describe("buffer deserialization", () => {
		it("creates from buffer with correct value", () => {
			const buffer = Buffer.allocUnsafe(IP.size)
			buffer.writeUInt8(192, 0)
			buffer.writeUInt8(168, 1)
			buffer.writeUInt8(1, 2)
			buffer.writeUInt8(1, 3)

			expect(IP.fromBuffer(buffer)).toBe("192.168.1.1")
		})

		it("creates from buffer with correct value at offset", () => {
			const buffer = Buffer.allocUnsafe(IP.size + 2)
			buffer.writeUInt8(192, 2)
			buffer.writeUInt8(168, 3)
			buffer.writeUInt8(1, 4)
			buffer.writeUInt8(1, 5)

			expect(IP.fromBuffer(buffer, 2)).toBe("192.168.1.1")
		})

		it("handles zero values", () => {
			const buffer = Buffer.allocUnsafe(IP.size)
			buffer.writeUInt8(0, 0)
			buffer.writeUInt8(0, 1)
			buffer.writeUInt8(0, 2)
			buffer.writeUInt8(0, 3)

			expect(IP.fromBuffer(buffer)).toBe("0.0.0.0")
		})
	})
})

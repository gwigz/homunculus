import { packets } from "~/network"

packets.createRegionHandshakeDelegate({
	handle: (packet, context) => {
		context.client.emit("debug", "Region handshake complete...")

		context.client.self.isEstateManager =
			packet.data.regionInfo!.isEstateManager === true

		context.circuit.send([
			packets.regionHandshakeReply({ regionInfo: { flags: 1 | 4 } }),
		])
	},
})

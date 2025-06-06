import { packets } from "~/network"

const VOCACHE_CULLING_ENABLED = 0x1 // sends all cacheable objects
const VOCACHE_IS_EMPTY = 0x2 // marks cache as empty, which stops cache object update requests
// const SUPPORTS_SELF_APPEARANCE = 0x4 // allows self appearance updates

packets.createRegionHandshakeDelegate({
	handle: (packet, context) => {
		context.client.emit("debug", "Region handshake complete!")

		context.client.self.isEstateManager =
			packet.data.regionInfo!.isEstateManager === true

		// NOTE: this should be skipped if we don't care for object updates
		context.circuit.send([
			packets.regionHandshakeReply({
				regionInfo: { flags: VOCACHE_CULLING_ENABLED | VOCACHE_IS_EMPTY },
			}),
		])
	},
})

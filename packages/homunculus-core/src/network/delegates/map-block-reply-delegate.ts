import { packets } from "~/network"

packets.createMapBlockReplyDelegate({
	handle: (packet, context) => {
		for (const mapBlock of packet.data.data!) {
			const x = mapBlock.x * 256
			const y = mapBlock.y * 256

			const handle = ((BigInt(x) << 32n) | BigInt(y)).toString()

			if (context.client.regions.has(handle)) {
				context.client.regions.get(handle)?.update({
					name: mapBlock.name.toString().slice(0, -1),
				})
			} else {
				context.client.emit(
					"error",
					new Error(
						`Received unexpected map reply for region "${mapBlock.name.toString().slice(0, -1)}".`,
					),
				)
			}
		}
	},
})

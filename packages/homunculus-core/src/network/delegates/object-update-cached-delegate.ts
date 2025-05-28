import { packets } from "~/network"

packets.createObjectUpdateCachedDelegate({
	handle: (packet, context) => {
		const uncached = packet.data.objectData!.map((data) => ({
			id: data.id,
			cacheMissType: 0,
		}))

		context.circuit.send([
			packets.requestMultipleObjects({ objectData: uncached }),
		])
	},
})

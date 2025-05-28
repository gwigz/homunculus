import { packets } from "~/network"

packets.createKillObjectDelegate({
	handle: (packet, context) => {
		for (const region of context.client.regions.values()) {
			for (const { id } of packet.data.objectData!) {
				if (!region.objects.has(id)) {
					continue
				}

				const object = region.objects.get(id)!

				object.dead = true

				for (const child of object.children) {
					if (region.objects.has(child)) {
						region.objects.get(child)!.dead = true
						region.objects.delete(child)
					}
				}

				if (region.agents.has(object.key)) {
					region.agents.delete(object.key)
				}

				region.objects.delete(id)
			}
		}
	},
})

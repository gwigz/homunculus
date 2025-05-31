import { packets } from "~/network"
import type { CollisionTypeLabel } from "~/types"

const collisionTypeMap = {
	0: "invalid",
	1: "bump",
	2: "scripted-push",
	3: "selected-object",
	4: "scripted-object",
	5: "physical-object",
} as const satisfies Record<number, CollisionTypeLabel>

packets.createMeanCollisionAlertDelegate({
	handle: (packet, context) => {
		for (const { perp, time, mag, type } of packet.data.meanCollision ?? []) {
			context.client.self.emit("collision", {
				source: perp,
				timestamp: time,
				magnitude: mag,
				type:
					collisionTypeMap[type as keyof typeof collisionTypeMap] ??
					("invalid" as CollisionTypeLabel),
			})
		}
	},
	skip: (_, context) => !context.client.self.listenerCount("collision"),
})

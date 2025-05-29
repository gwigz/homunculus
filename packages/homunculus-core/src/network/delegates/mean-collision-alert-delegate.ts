import { packets } from "~/network"

const collisionTypeMap = {
	0: "invalid",
	1: "bump",
	2: "scripted-push",
	3: "selected-object",
	4: "scripted-object",
	5: "physical-object",
} as const

type CollisionType = keyof typeof collisionTypeMap
type CollisionTypeLabel = (typeof collisionTypeMap)[CollisionType]

export interface SelfCollision {
	/** Key of the object or avatar that caused the collision */
	source: string
	/** Timestamp of the collision */
	timestamp: number
	/** Magnitude of the collision */
	magnitude: number
	/** Type of the collision */
	type: CollisionTypeLabel
}

packets.createMeanCollisionAlertDelegate({
	handle: (packet, context) => {
		for (const { perp, time, mag, type } of packet.data.meanCollision ?? []) {
			context.client.self.emit("collision", {
				source: perp,
				timestamp: time,
				magnitude: mag,
				type:
					collisionTypeMap[type as CollisionType] ||
					("invalid" as CollisionTypeLabel),
			})
		}
	},
	skip: (_, context) => !context.client.self.listenerCount("collision"),
})

import { type MeanCollisionAlertData, packets } from "~/network"

type MeanCollision = Omit<
	NonNullable<MeanCollisionAlertData["meanCollision"]>[number],
	"victim" | "type"
>

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

export interface SelfCollision extends MeanCollision {
	type: CollisionTypeLabel
}

packets.createMeanCollisionAlertDelegate({
	handle: (packet, context) => {
		for (const collision of packet.data.meanCollision ?? []) {
			context.client.self.emit("collision", {
				...collision,
				type:
					collisionTypeMap[collision.type as CollisionType] ||
					("invalid" as CollisionTypeLabel),
			})
		}
	},
	skip: (_, context) => !context.client.self.listenerCount("collision"),
})

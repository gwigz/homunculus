import { Client, Constants } from "../src"
import type { Agent } from "../src/structures"

const client = new Client()

let scanInterval: NodeJS.Timeout
let controlInterval: NodeJS.Timeout
let closestAvatar: Agent | undefined
let closestDistance: number | undefined

client.on("ready", () => {
	controlInterval = setInterval(() => {
		const self = client.self!
		const homing = closestDistance && closestDistance < 5

		// nudge forwards if we're homing
		self.controlFlags = homing
			? Constants.ControlFlags.NUDGE_AT_POS
			: Constants.ControlFlags.NONE

		if (homing && closestAvatar) {
			// rotate to face the closest avatar
			// TODO: utilities for facing a point, avatar, or entity
			const direction = [
				closestAvatar.entity.position![0] - self.position![0],
				closestAvatar.entity.position![1] - self.position![1],
				closestAvatar.entity.position![2] - self.position![2],
			] as const

			const angle = Math.atan2(direction[1], direction[0])

			const cos = Math.cos(angle)
			const sin = Math.sin(angle)

			self.rotation = [0, 0, sin, cos]
		}

		self.sendAgentUpdate()
	}, 50)

	scanInterval = setInterval(() => {
		const self = client.self!
		const avatars = client.regions.values().next().value?.agents

		closestDistance = Number.POSITIVE_INFINITY
		closestAvatar = undefined

		for (const avatar of avatars?.values() ?? []) {
			if (!avatar.entity.position || avatar.key === self.key) {
				continue
			}

			// TODO: utilities for distance calculations
			const distance = Math.sqrt(
				(avatar.entity.position[0] - self.position[0]) ** 2 +
					(avatar.entity.position[1] - self.position[1]) ** 2 +
					(avatar.entity.position[2] - self.position[2]) ** 2,
			)

			if (distance < closestDistance) {
				closestDistance = distance
				closestAvatar = avatar
			}
		}

		if (closestAvatar) {
			console.log("Targeting", closestAvatar.name, "@", closestDistance)
		} else {
			console.log("No target found")
		}
	}, 500)
})

client.on("debug", console.debug)
client.on("warning", console.warn)
client.on("error", console.error)

// by default, we connect using the SL_USERNAME, SL_PASSWORD, and SL_START
// environment variables -- alternatively, you can just pass those values in
await client.connect()

async function exit() {
	clearInterval(scanInterval)
	clearInterval(controlInterval)

	// ensures we disconnect safely, otherwise login may get blocked for a period
	await client.disconnect()

	process.exit(0)
}

process.on("SIGINT", exit)
process.on("SIGTERM", exit)

import { type Agent, Client, Constants, Quaternion } from "../src"

const client = new Client()

let closestAgent: Agent | undefined
let closestDistance: number | undefined

let lastControlFlags = 0
let lastAngle = 0

client.on("ready", () => {
	setInterval(() => {
		const self = client.self!
		const homing = closestDistance && closestDistance < 5

		// nudge forwards if we're homing
		self.controlFlags = homing
			? Constants.ControlFlags.NUDGE_AT_POS
			: Constants.ControlFlags.NONE

		const angle =
			homing && closestAgent?.entity
				? Math.atan2(
						closestAgent.entity.position!.y - self.position.y,
						closestAgent.entity.position!.x - self.position.x,
					)
				: lastAngle

		const angleChanged = Math.abs(lastAngle - angle) > 0.01

		if (lastControlFlags !== self.controlFlags || angleChanged) {
			lastControlFlags = self.controlFlags

			if (angleChanged) {
				self.rotation = new Quaternion(0, 0, Math.sin(angle), Math.cos(angle))
				lastAngle = angle
			}

			self.sendAgentUpdate()
		}
	}, 50)

	setInterval(() => {
		const self = client.self!
		const agents = client.nearby.agents

		closestDistance = Number.POSITIVE_INFINITY
		closestAgent = undefined

		for (const agent of agents) {
			if (!agent.entity?.position || agent.key === self.key) {
				continue
			}

			const distance = agent.entity.position.distance(self.position)

			if (distance < closestDistance) {
				closestDistance = distance
				closestAgent = agent
			}
		}

		if (closestAgent) {
			console.log("Targeting", closestAgent.name, "@", closestDistance)
		} else {
			console.log("No target found")
		}
	}, 500)
})

client.connect()

import {
	type Agent,
	Client,
	Constants,
	Quaternion,
} from "@gwigz/homunculus-core"

const client = new Client()

let closestAgent: Agent | undefined
let closestDistance: number | undefined

client.on("ready", () => {
	setInterval(() => {
		const self = client.self!
		const homing = closestDistance && closestDistance < 5

		// nudge forwards if we're homing
		self.controlFlags = homing
			? Constants.ControlFlags.NUDGE_AT_POS
			: Constants.ControlFlags.NONE

		if (homing && closestAgent?.entity) {
			// rotate to face the closest avatar
			// TODO: utilities for facing a point, avatar, or entity
			const angle = Math.atan2(
				closestAgent.entity.position!.y - self.position.y,
				closestAgent.entity.position!.x - self.position.x,
			)

			const cos = Math.cos(angle)
			const sin = Math.sin(angle)

			self.rotation = new Quaternion(0, 0, sin, cos)
		}

		self.sendAgentUpdate()
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

			// TODO: utilities for distance calculations
			const distance = Math.sqrt(
				(agent.entity.position.x - self.position.x) ** 2 +
					(agent.entity.position.y - self.position.y) ** 2 +
					(agent.entity.position.z - self.position.z) ** 2,
			)

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

import { Buffer } from "node:buffer"
import { packets } from "~/network"
import { Region } from "~/structures"

let counter = 0

packets.createAgentMovementCompleteDelegate({
	handle: async (packet, context) => {
		context.client.emit("debug", "Agent movement complete...")

		// const sim = packet.data.simData[0]
		// const simulator = this.client.simulator

		// simulator.channel = sim.channelVersion

		const data = packet.data.data!

		context.client.self.position = data.position
		context.client.self.lookAt = data.lookAt

		const handle = data.regionHandle as bigint

		const region = context.client.regions.get(handle)

		if (!region) {
			context.client.regions.set(handle, new Region(context.client, { handle }))
		} else if (!region.name) {
			// request region name if we know about it already, but haven't received it yet
			region.init()
		}

		// client.throttle/bandwidth?
		const throttle = 500 * 1024

		const resend = throttle * 0.1
		const land = throttle * 0.172
		const wind = throttle * 0.05
		const cloud = throttle * 0.05
		const task = throttle * 0.234
		const texture = throttle * 0.234
		const asset = throttle * 0.16

		const throttles = Buffer.allocUnsafe(7 * 4)

		throttles.writeFloatLE(resend, 0)
		throttles.writeFloatLE(land, 4)
		throttles.writeFloatLE(wind, 8)
		throttles.writeFloatLE(cloud, 12)
		throttles.writeFloatLE(task, 16)
		throttles.writeFloatLE(texture, 20)
		throttles.writeFloatLE(asset, 24)

		await context.circuit.send([
			packets.agentThrottle({
				throttle: { genCounter: counter++, throttles },
			}),
			packets.setAlwaysRun({ agentData: { alwaysRun: false } }),
			// new AgentDataUpdateRequest(),
		])

		// notify the core that we're connected, after a short delay
		setTimeout(() => context.core.ready(), 1_000)
	},
})

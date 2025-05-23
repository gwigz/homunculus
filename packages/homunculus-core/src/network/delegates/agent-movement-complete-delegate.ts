import assert from "node:assert"
import Region from "../../structures/region"
import {
	type AgentMovementComplete,
	AgentThrottle,
	AgentUpdate,
	SetAlwaysRun,
} from "../packets"
import Delegate from "./delegate"

class AgentMovementCompleteDelegate extends Delegate {
	private counter = 0

	public async handle(packet: AgentMovementComplete) {
		this.client.emit("debug", "Agent movement complete...")

		const client = this.client
		const self = client.self

		assert(self, "Self not found")

		const data = packet.data.data[0]

		// const sim = packet.data.simData[0]
		// const simulator = this.client.simulator

		// simulator.channel = sim.channelVersion

		self.position = data.position
		// self.rotation = data.lookAt // this is not quaternion

		// TODO: setup an actual objects for region handle (so we can have sugar for
		// global to local transformations).
		self.offset = [
			Number(data.regionHandle >> 32n),
			Number(data.regionHandle & 0xffffffffn),
			0.0,
		]

		client.regions.set(
			data.regionHandle.toString(),
			new Region(client, { handle: data.regionHandle }),
		)

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

		await this.circuit.send([
			new AgentThrottle({
				throttle: { genCounter: this.counter++, throttles },
			}),
			new SetAlwaysRun({ agentData: { alwaysRun: false } }),
			// new AgentDataUpdateRequest(),
		])

		await this.circuit.send([
			new AgentUpdate({
				bodyRotation: self.rotation,
				headRotation: self.rotation,
				state: self.state,
				cameraCenter: self.position,
				cameraAtAxis: [0.979546, 0.105575, -0.171303],
				cameraLeftAxis: [-1.0, 0.0, 0.0],
				cameraUpAxis: [0.0, 0.0, 1.0],
				far: 40,
				controlFlags: self.controlFlags,
				flags: 0,
			}),
		])

		// notify the core that we're connected
		setTimeout(() => this.circuit.core.ready(), 1000)
	}
}

export default AgentMovementCompleteDelegate

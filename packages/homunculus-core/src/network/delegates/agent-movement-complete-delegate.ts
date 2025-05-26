import assert from "node:assert"
import Region from "../../structures/region"
import { Constants } from "../../utilities"
import {
	type AgentMovementComplete,
	AgentThrottle,
	SetAlwaysRun,
} from "../packets"
import Vector3 from "../types/vector-3"
import Delegate from "./delegate"

class AgentMovementCompleteDelegate extends Delegate {
	private counter = 0

	public override async handle(packet: AgentMovementComplete) {
		this.client.emit("debug", "Agent movement complete...")

		const client = this.client
		const self = client.self

		assert(self, "Self not found")

		const data = packet.data.data[0]

		// const sim = packet.data.simData[0]
		// const simulator = this.client.simulator

		// simulator.channel = sim.channelVersion

		self.position = data.position
		self.lookAt = data.lookAt

		// TODO: setup an actual objects for region handle (so we can have sugar for
		// global to local transformations).
		self.offset = new Vector3(
			Number(data.regionHandle >> 32n),
			Number(data.regionHandle & 0xffffffffn),
			0,
		)

		const region = new Region(client, { handle: data.regionHandle })

		client.region = region
		client.regions.set(data.regionHandle.toString(), region)

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

		// send initial agent updates, finish animation avoids agent being stuck in
		// a weird squatting animation on login
		if (this.client.self) {
			this.client.self.controlFlags = Constants.ControlFlags.FINISH_ANIM
			this.client.self.sendAgentUpdate()
		}

		// notify the core that we're connected
		setTimeout(() => this.circuit.core.ready(), 1000)
	}
}

export default AgentMovementCompleteDelegate

import Region from "../../structures/region"
import type { AgentMovementComplete as AgentMovementCompletePacket } from "../packets"
import * as Packets from "../packets"
import Delegate from "./delegate"

class AgentMovementComplete extends Delegate {
	private counter = 0

	public handle(packet: AgentMovementCompletePacket) {
		const client = this.client
		const self = client.self

		if (!self) {
			return
		}

		const data = packet.data.data[0]

		// const sim = packet.data.simData[0]
		// const simulator = this.client.simulator

		// simulator.channel = sim.channelVersion

		self.position = data.position
		self.rotation = data.lookAt

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
		const land = throttle * 0.1
		const wind = throttle * 0.02
		const cloud = throttle * 0.02
		const task = throttle * 0.31
		const texture = throttle * 0.31
		const asset = throttle * 0.14

		const throttles = Buffer.allocUnsafe(7 * 4)

		throttles.writeFloatLE(resend, 0)
		throttles.writeFloatLE(land, 4)
		throttles.writeFloatLE(wind, 8)
		throttles.writeFloatLE(cloud, 12)
		throttles.writeFloatLE(task, 16)
		throttles.writeFloatLE(texture, 20)
		throttles.writeFloatLE(asset, 24)

		this.circuit.send(
			new Packets.AgentThrottle({
				throttle: {
					genCounter: this.counter++,
					throttles,
				},
			}),
		)

		this.circuit.send(
			new Packets.AgentFOV({
				fovBlock: {
					genCounter: this.counter++,
					// client.fov or camera.fov?
					verticalAngle: Math.PI * 2 - 0.05,
				},
			}),
		)

		this.circuit.send(
			new Packets.AgentHeightWidth({
				heightWidthBlock: {
					genCounter: this.counter++,
					height: 360,
					width: 640,
				},
			}),
		)

		this.circuit.send(
			new Packets.SetAlwaysRun({
				agentData: { alwaysRun: false },
			}),
		)

		// TODO: add toggle to enable/disable these packets, as they allow object
		// data to start being received, which we may or may not want...
		this.circuit.send(
			new Packets.AgentUpdate({
				agentData: {
					bodyRotation: self.rotation,
					headRotation: [0.0, 0.0, 0.0, 0.0],
					state: self.state,
					cameraCenter: self.position,
					cameraAtAxis: [0.0, 0.0, 0.0],
					cameraLeftAxis: [0.0, 0.0, 0.0],
					cameraUpAxis: [0.0, 0.0, 0.0],
					// client or camera.distance or something?
					far: 20,
					controlFlags: 65536,
					// for auto pilot: 0x02
					flags: 0,
				},
			}),
		)
	}
}

export default AgentMovementComplete

import { Client, Constants, Quaternion } from "../src"

const client = new Client()
const controls = Object.values(Constants.ControlFlags)

let rotationInterval: NodeJS.Timeout
let controlInterval: NodeJS.Timeout

let angle = 0
let sitting = false

client.on("ready", () => {
	controlInterval = setInterval(() => {
		const self = client.self!

		/**
		 * @see {@link https://wiki.secondlife.com/wiki/How_movement_works}
		 */
		self.controlFlags = controls[Math.floor(Math.random() * controls.length)]!

		// stand instead, if we recently sat
		if (self.controlFlags & Constants.ControlFlags.SIT_ON_GROUND) {
			sitting = true
		} else if (sitting) {
			sitting = false
			self.controlFlags = Constants.ControlFlags.STAND_UP
		}
	}, 1000)

	rotationInterval = setInterval(() => {
		const self = client.self!

		angle += 0.1

		const cos = Math.cos(angle / 2)
		const sin = Math.sin(angle / 2)

		self.rotation = new Quaternion(0, 0, sin, cos)
		self.sendAgentUpdate()
	}, 100)
})

client.on("debug", console.debug)
client.on("warning", console.warn)
client.on("error", console.error)

// by default, we connect using the SL_USERNAME, SL_PASSWORD, and SL_START
// environment variables -- alternatively, you can just pass those values in
client.connect()

async function exit() {
	clearInterval(rotationInterval)
	clearInterval(controlInterval)

	// ensures we disconnect safely, otherwise login may get blocked for a period
	await client.disconnect()

	process.exit(0)
}

process.on("SIGINT", exit)
process.on("SIGTERM", exit)

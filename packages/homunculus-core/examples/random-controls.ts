import { Client, Constants } from "../src"

const client = new Client()
const controls = Object.values(Constants.ControlFlags)

let interval: NodeJS.Timeout

client.on("ready", () => {
	let angle = 0

	interval = setInterval(() => {
		const self = client.self!

		angle += 0.2

		const cos = Math.cos(angle / 2)
		const sin = Math.sin(angle / 2)

		self.rotation = [sin, 0, 0, cos]
		self.controlFlags = controls[Math.floor(Math.random() * controls.length)]!
		self.sendAgentUpdate()
	}, 1000)
})

client.on("debug", console.debug)
client.on("warning", console.warn)
client.on("error", console.error)

// by default, we connect using the SL_USERNAME, SL_PASSWORD, and SL_START
// environment variables -- alternatively, you can just pass those values in
await client.connect(process.env.SL_USERNAME!, process.env.SL_PASSWORD!, {
	login: {
		start: process.env.SL_START,
		// mfaToken: process.env.SL_MFA_TOKEN,
		mfaTokenHash: process.env.SL_MFA_HASH,
	},
})

async function exit() {
	clearInterval(interval)

	// ensures we disconnect safely, otherwise login may get blocked for a period
	await client.disconnect()

	process.exit(0)
}

process.on("SIGINT", exit)
process.on("SIGTERM", exit)

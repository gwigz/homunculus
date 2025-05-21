import assert from "node:assert"
import { Client, Constants } from "../../src"

const client = new Client()

// client.on("ready", () => ...)

client.nearby.on("chat", (chat) => {
	if (
		chat.chatType === Constants.ChatTypes.NORMAL &&
		chat.sourceType === Constants.ChatSources.AGENT &&
		chat.message.includes("ping")
	) {
		client.nearby.message("pong")
	}
})

client.on("debug", console.debug)
client.on("warning", console.warn)
client.on("error", console.error)

assert(process.env.USERNAME, "USERNAME env value is not set")
assert(process.env.PASSWORD, "PASSWORD env value is not set")

assert(
	process.env.START
		? /^(?:uri:[A-Za-z0-9 ]+&\d{1,3}&\d{1,3}&\d{1,4}|first|last)$/.test(
				process.env.START,
			)
		: true,
	"START env value is invalid",
)

await client.connect(
	process.env.USERNAME,
	process.env.PASSWORD,
	process.env.START,
)

async function exit() {
	console.log("Shutting down...")

	await client.disconnect()

	process.exit(0)
}

process.on("SIGINT", exit)
process.on("SIGTERM", exit)

import assert from "node:assert"
import { Client, Constants } from "../../src"

const client = new Client()

client.nearby.on("chat", (chat) => {
	if (
		chat.chatType === Constants.ChatTypes.NORMAL &&
		chat.sourceType === Constants.ChatSources.AGENT
	) {
		if (chat.message.includes("ping")) {
			client.nearby.message("pong")
		}

		console.log(chat)
	}
})

client.on("debug", console.debug)
client.on("warning", console.warn)
client.on("error", console.error)

assert(process.env.SL_USERNAME, "SL_USERNAME env value is not set")
assert(process.env.SL_PASSWORD, "SL_PASSWORD env value is not set")

assert(
	process.env.SL_START
		? /^(?:uri:[A-Za-z0-9 ]+&\d{1,3}&\d{1,3}&\d{1,4}|first|last)$/.test(
				process.env.SL_START,
			)
		: true,
	"SL_START env value is invalid",
)

await client.connect(
	process.env.SL_USERNAME,
	process.env.SL_PASSWORD,
	process.env.SL_START,
)

async function exit() {
	console.log("Shutting down...")

	await client.disconnect()

	process.exit(0)
}

process.on("SIGINT", exit)
process.on("SIGTERM", exit)

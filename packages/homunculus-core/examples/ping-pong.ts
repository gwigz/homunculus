import { Client, Constants } from "../src"

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

// by default, we connect using the SL_USERNAME, SL_PASSWORD, and SL_START
// environment variables -- alternatively, you can just pass those values in
await client.connect()

async function exit() {
	// ensures we disconnect safely, otherwise login may get blocked for a period
	await client.disconnect()

	process.exit(0)
}

process.on("SIGINT", exit)
process.on("SIGTERM", exit)

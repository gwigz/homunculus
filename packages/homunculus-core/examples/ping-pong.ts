import { Client, Constants } from "@gwigz/homunculus-core"

const client = new Client()

client.nearby.on("chat", (chat) => {
	if (
		chat.type === Constants.ChatTypes.NORMAL &&
		chat.sourceType === Constants.ChatSources.AGENT
	) {
		if (chat.message.includes("ping")) {
			client.nearby.message("pong")
		}

		console.log(chat)
	}
})

client.connect()

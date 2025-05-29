// NOTE: you would normally import from "@gwigz/homunculus-bot" (not "../src")
import { Client } from "@gwigz/homunculus-core"
import { Bot } from "../src"

const client = new Client()
const bot = new Bot(client, { commandPrefix: "!" })

// register a command that responds to `!ping`
bot.registerCommand({
	action: "ping",
	process(client, data, { fromName }) {
		// return a message (to local chat)
		return `Pong ${fromName}!`
	},
})

client.connect()

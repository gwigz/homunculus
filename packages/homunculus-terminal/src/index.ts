#!/usr/bin/env node

process.title = "homunculus-terminal"

import assert from "node:assert"
import fs from "node:fs"
import path from "node:path"
import blessed from "blessed"
import meow from "meow"
import { Client, Constants } from "../../homunculus-core/src"

const cli = meow(
	`
	Usage
	  $ homunculus

	Options
		--start=<uri|last|home>

	Examples
	  $ homunculus --start="uri:Bug Island&128&128&0"
`,
	{
		importMeta: import.meta,
		flags: {
			start: {
				type: "string",
			},
		},
	},
)

assert(process.env.USERNAME, "USERNAME env value is not set")
assert(process.env.PASSWORD, "PASSWORD env value is not set")

const start = cli.flags.start || process.env.START

assert(
	start
		? /^(?:uri:[A-Za-z0-9 ]+&\d{1,3}&\d{1,3}&\d{1,4}|first|last)$/.test(start)
		: true,
	"START env value is invalid",
)

const logFile = path.join(process.cwd(), "homunculus-error.log")

const logError = (error: Error | string) => {
	const timestamp = new Date().toISOString()
	const message = error instanceof Error ? error.stack || error.message : error

	fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`)
}

process.on("uncaughtException", (error) => {
	logError(error)

	console.error("Uncaught Exception:", error)
	process.exit(1)
})

process.on("unhandledRejection", (reason) => {
	logError(reason instanceof Error ? reason : new Error(String(reason)))

	console.error("Unhandled Rejection:", reason)
	process.exit(1)
})

const screen = blessed.screen({
	title: "Homunculus Terminal",
	smartCSR: true,
	dockBorders: true,
})

const chatBox = blessed.box({
	top: 0,
	left: 0,
	width: "100%-24",
	height: "100%-2",
	scrollable: true,
	keys: true,
	mouse: true,
	vi: true,
	alwaysScroll: true,
	scrollback: 200,
	tags: true,
	border: {
		type: "line",
	},
	scrollbar: {
		style: {
			bg: "blue",
			fg: "white",
		},
		track: {
			bg: "black",
			fg: "gray",
		},
		ch: "█",
	},
	style: {
		border: {
			color: "gray",
		},
	},
})

const inputBox = blessed.textbox({
	bottom: 0,
	left: 0,
	width: "100%-24",
	height: 3,
	inputOnFocus: true,
	keys: true,
	mouse: true,
	border: {
		type: "line",
	},
	style: {
		border: {
			color: "gray",
		},
	},
})

const nearbyAvatars = blessed.box({
	top: 0,
	right: 0,
	width: 24,
	height: "100%",
	border: {
		type: "line",
	},
	style: {
		border: {
			color: "gray",
		},
	},
})

screen.append(chatBox)
screen.append(inputBox)
screen.append(nearbyAvatars)

inputBox.focus()

const client = new Client()

function addChat(
	fromName: string,
	message: string,
	type: number = Constants.ChatTypes.NORMAL,
	sourceType: number = Constants.ChatSources.SYSTEM,
) {
	const timestamp = new Date().toLocaleTimeString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h24",
	})

	const name = fromName.replace(/ Resident$/, "")

	let color = ""
	let style = ""
	let separator = ": "
	let text = message

	if (type === Constants.ChatTypes.OWNERSAY) {
		color = "{yellow-fg}"
	} else if (sourceType === Constants.ChatSources.OBJECT) {
		color = "{green-fg}"
	} else if (sourceType === Constants.ChatSources.SYSTEM) {
		color = "{cyan-fg}"
	}

	if (type === Constants.ChatTypes.SHOUT) {
		style = "{bold}"
	} else if (type === Constants.ChatTypes.WHISPER) {
		// style = "{italic}"

		if (!color) {
			color = "{gray-fg}"
		}
	}

	if (message.startsWith("/me ")) {
		separator = " "
		text = message.substring(4)
	} else if (message.startsWith("/me'")) {
		separator = "'"
		text = message.substring(4)
	} else if (type === Constants.ChatTypes.SHOUT) {
		separator = " shouts: "
	} else if (type === Constants.ChatTypes.WHISPER) {
		separator = " whispers: "
	}

	const formattedMessage = `[${timestamp}] {bold}${color}${blessed.escape(name)}{/bold}${style}${color}${separator}${blessed.escape(text)}{/}`

	chatBox.pushLine(formattedMessage)
	chatBox.setScrollPerc(100)

	screen.render()
}

client.on("debug", (message) =>
	addChat("[DEBUG]", `/me ${message}`, Constants.ChatTypes.DEBUG),
)

client.on("warning", (message) => addChat("[WARNING]", `/me ${message}`))

client.on("error", (error) => {
	addChat("[ERROR]", `/me ${error.message}`)
	logError(error)
})

const ignoredChatTypes = [
	Constants.ChatTypes.TYPING,
	Constants.ChatTypes.STOPPED,
] as number[]

client.nearby.on("chat", (chat) => {
	if (!ignoredChatTypes.includes(chat.chatType) && chat.message.length) {
		addChat(chat.fromName, chat.message, chat.chatType, chat.sourceType)
	}
})

function updateNearbyObjects() {
	nearbyAvatars.setContent("")

	for (const region of client.regions.values()) {
		nearbyAvatars.pushLine(`${region.objects.size} objects`)
		nearbyAvatars.pushLine(`${region.agents.size} agents`)
	}

	nearbyAvatars.pushLine("—")

	for (const region of client.regions.values()) {
		nearbyAvatars.pushLine(`${region.handle}`)

		for (const agent of region.agents.values()) {
			nearbyAvatars.pushLine(blessed.escape(agent.key))
		}
	}

	nearbyAvatars.pushLine("—")

	const uniqueTypes = new Map<number, number>()

	for (const region of client.regions.values()) {
		for (const object of region.objects.values()) {
			uniqueTypes.set(object.type, (uniqueTypes.get(object.type) ?? 0) + 1)
		}
	}

	for (const [type, count] of uniqueTypes.entries()) {
		nearbyAvatars.pushLine(`${count} (${type})`)
	}
}

function updateRegions() {
	for (const region of client.regions.values()) {
		// region.agents.on("set", updateNearbyObjects)
		// region.agents.on("delete", updateNearbyObjects)
		region.objects.on("set", updateNearbyObjects)
		region.objects.on("delete", updateNearbyObjects)
	}
}

client.regions.on("set", updateRegions)
client.regions.on("delete", updateRegions)

inputBox.on("submit", (value: string) => {
	let message = value.trim()

	if (!message.length) {
		return
	}

	inputBox.clearValue()
	inputBox.focus()

	let channel = 0
	let type = Constants.ChatTypes.NORMAL as number

	if (message.startsWith("/")) {
		if (message === "/quit" || message === "/exit") {
			return exit()
		}

		if (message.startsWith("/shout ")) {
			type = Constants.ChatTypes.SHOUT
			message = message.substring(7)
		} else if (message.startsWith("/whisper ")) {
			type = Constants.ChatTypes.WHISPER
			message = message.substring(9)
		} else {
			const match = message.match(/^\/(\d+)/)

			if (match?.[1]) {
				const parsedChannel = Number.parseInt(match[1])

				if (parsedChannel >= 1) {
					channel = parsedChannel
				}
			}
		}
	}

	if (type === Constants.ChatTypes.WHISPER) {
		client.nearby.whisper(message, channel)
	} else if (type === Constants.ChatTypes.SHOUT) {
		client.nearby.shout(message, channel)
	} else {
		client.nearby.say(message, channel)
	}

	screen.render()
})

async function exit() {
	addChat("[INFO]", "/me Disconnecting...")

	try {
		await client.disconnect()
	} catch (error: unknown) {
		logError(error instanceof Error ? error : new Error(String(error)))

		console.error("Error during disconnect:", error)
	}

	await new Promise((resolve) => setTimeout(resolve, 2000))

	screen.destroy()
	process.exit(0)
}

process.on("SIGINT", exit)
process.on("SIGTERM", exit)

try {
	await client.connect(process.env.USERNAME!, process.env.PASSWORD!, start)
} catch (error: unknown) {
	logError(error instanceof Error ? error : new Error(String(error)))

	console.error("Connection error:", error)
	process.exit(1)
}

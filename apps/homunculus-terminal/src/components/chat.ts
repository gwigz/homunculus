import {
	type Client,
	Constants,
	type NearbyChatMessage,
} from "@gwigz/homunculus-core"
import blessed from "blessed"
import { logError } from "../logger"

export function createChat(screen: blessed.Widgets.Screen) {
	const chatBox = blessed.box({
		top: 0,
		left: 0,
		width: "100%-24",
		height: "100%-2",
		scrollable: true,
		keys: true,
		mouse: true,
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
		scrollable: true,
		keys: true,
		mouse: true,
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

	screen.append(chatBox)
	screen.append(inputBox)
	screen.append(nearbyAvatars)

	inputBox.focus()

	return {
		chatBox,
		inputBox,
		nearbyAvatars,
	}
}

type Components = ReturnType<typeof createChat>

export function addChatMessage(
	screen: blessed.Widgets.Screen,
	components: Components,
	{
		fromName = "Unknown",
		message = "",
		chatType = Constants.ChatTypes.NORMAL,
		sourceType = Constants.ChatSources.SYSTEM,
	}: Partial<NearbyChatMessage>,
) {
	if (!message.length) {
		return
	}

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

	if (chatType === Constants.ChatTypes.OWNERSAY) {
		color = "{yellow-fg}"
	} else if (sourceType === Constants.ChatSources.OBJECT) {
		color = "{green-fg}"
	} else if (sourceType === Constants.ChatSources.SYSTEM) {
		color = "{cyan-fg}"
	}

	if (chatType === Constants.ChatTypes.SHOUT) {
		style = "{bold}"
	} else if (chatType === Constants.ChatTypes.WHISPER) {
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
	} else if (chatType === Constants.ChatTypes.SHOUT) {
		separator = " shouts: "
	} else if (chatType === Constants.ChatTypes.WHISPER) {
		separator = " whispers: "
	}

	const formattedMessage = `[${timestamp}] {bold}${color}${blessed.escape(name)}{/bold}${style}${color}${separator}${blessed.escape(text)}{/}`

	components.chatBox.pushLine(formattedMessage)
	components.chatBox.setScrollPerc(100)

	screen.render()
}

export function setupChatHandlers(
	screen: blessed.Widgets.Screen,
	components: Components,
	client: Client,
	onExit: () => Promise<void>,
) {
	const { inputBox, nearbyAvatars } = components

	client.on("debug", (message) =>
		addChatMessage(screen, components, {
			fromName: "[DEBUG]",
			message: `/me ${message}`,
			chatType: Constants.ChatTypes.DEBUG,
		}),
	)

	client.on("warning", (message) =>
		addChatMessage(screen, components, {
			fromName: "[WARNING]",
			message: `/me ${message}`,
		}),
	)

	client.on("error", (error) => {
		addChatMessage(screen, components, {
			fromName: "[ERROR]",
			message: `/me ${error.message}`,
		})

		logError(error)
	})

	const ignoredChatTypes = [
		Constants.ChatTypes.TYPING,
		Constants.ChatTypes.STOPPED,
	] as number[]

	client.nearby.on("chat", (chat) => {
		if (!ignoredChatTypes.includes(chat.chatType) && chat.message.length) {
			addChatMessage(screen, components, {
				fromName: chat.fromName,
				message: chat.message,
				chatType: chat.chatType,
				sourceType: chat.sourceType,
			})
		}

		updateNearbyObjects()
	})

	function updateNearbyObjects() {
		nearbyAvatars.setContent("")

		for (const region of client.regions.values()) {
			nearbyAvatars.pushLine(`${region.objects.size} objects`)
			nearbyAvatars.pushLine(`${region.agents.size} agents`)
		}

		for (const region of client.regions.values()) {
			nearbyAvatars.pushLine("—")

			if (region.name) {
				nearbyAvatars.pushLine(`{bold}${region.name}{/}`)
			} else {
				nearbyAvatars.pushLine(
					`{bold}{gray-fg}Loading... (${region.handle}){/}`,
				)
			}

			for (const agent of region.agents.values()) {
				if (agent.key === client.self?.key) {
					continue
				}

				const name = agent.name

				nearbyAvatars.pushLine(
					name
						? blessed.escape(name)
						: `Loading... {gray-fg}(${agent.key.slice(0, 8)}){/}`,
				)
			}
		}
	}

	function updateRegions() {
		for (const region of client.regions.values()) {
			region.agents.on("set", updateNearbyObjects)
			region.agents.on("delete", updateNearbyObjects)
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
				return onExit()
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
	})
}

import { randomUUID } from "node:crypto"
import type { ForegroundColorName } from "chalk"
import { Box, Static, Text } from "ink"
import TextInput from "ink-text-input"
import { type ComponentProps, useCallback, useMemo, useState } from "react"
import { type Client, Constants } from "../../homunculus-core/src"
import type { NearbyChatMessage } from "../../homunculus-core/src/structures/nearby"

interface Props {
	client: Client
	start?: string
}

const ignoredChatTypes = [
	Constants.ChatTypes.TYPING,
	Constants.ChatTypes.STOPPED,
] as number[]

const chatTypeColors = {
	[Constants.ChatTypes.NORMAL]: "white",
	[Constants.ChatTypes.SHOUT]: "whiteBright", // TODO: bold
	[Constants.ChatTypes.WHISPER]: "white", // TODO: italic
	[Constants.ChatTypes.TYPING]: "gray",
	[Constants.ChatTypes.STOPPED]: "gray",
	[Constants.ChatTypes.DEBUG]: "redBright",
	[Constants.ChatTypes.OWNERSAY]: "yellowBright",
} satisfies Record<number, ForegroundColorName>

const chatSourceTypeColors = {
	[Constants.ChatSources.OBJECT]: "greenBright",
	[Constants.ChatSources.SYSTEM]: "magentaBright",
} satisfies Record<number, ForegroundColorName>

const systemChatValues = {
	source: "00000000-0000-0000-0000-000000000000",
	owner: "00000000-0000-0000-0000-000000000000",
	sourceType: Constants.ChatSources.SYSTEM,
	chatType: Constants.ChatTypes.NORMAL,
	audible: 0,
	position: [0, 0, 0] as NearbyChatMessage["position"],
} satisfies Partial<NearbyChatMessage>

interface ChatMessage extends NearbyChatMessage {
	id: string
}

function getChatMessageProps(message: ChatMessage) {
	return {
		color:
			message.sourceType === Constants.ChatSources.AGENT ||
			message.chatType === Constants.ChatTypes.OWNERSAY
				? (message.chatType &&
						chatTypeColors[message.chatType as keyof typeof chatTypeColors]) ||
					"red"
				: chatSourceTypeColors[
						message.sourceType as keyof typeof chatSourceTypeColors
					],
		bold: message.chatType === Constants.ChatTypes.SHOUT,
		italic: message.chatType === Constants.ChatTypes.WHISPER,
	} satisfies ComponentProps<typeof Text>
}

export default function App({ client, start }: Props) {
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [input, setInput] = useState("")

	useMemo(() => {
		function addChat(
			message: Partial<ChatMessage> & Pick<ChatMessage, "fromName" | "message">,
		) {
			setMessages((chat) => [
				...chat,
				{ id: randomUUID(), ...systemChatValues, ...message },
			])
		}

		client.on("debug", (message) =>
			addChat({ fromName: "[DEBUG]", message: `/me ${message}` }),
		)

		client.on("warning", (message) =>
			addChat({ fromName: "[WARNING]", message: `/me ${message}` }),
		)

		client.on("error", (error) =>
			addChat({ fromName: "[ERROR]", message: `/me ${error.message}` }),
		)

		// client.on("ready", () => ...)

		client.nearby.on("chat", (chat) => {
			if (!ignoredChatTypes.includes(chat.chatType) && chat.message.length) {
				addChat(chat)
			}
		})

		client.connect(process.env.USERNAME!, process.env.PASSWORD!, start)
	}, [client, start])

	const handleSubmit = useCallback(() => {
		let message = input.trim()

		if (!message.length) {
			return
		}

		let channel = 0
		let type = Constants.ChatTypes.NORMAL as number

		if (message.startsWith("/")) {
			if (message.startsWith("/shout ")) {
				type = Constants.ChatTypes.SHOUT
				message = message.substring(7)
			} else if (message.startsWith("/whisper ")) {
				type = Constants.ChatTypes.WHISPER
				message = message.substring(9)
			} else {
				const match = message.match(/^\/(\d+)/)

				if (match?.[1] && Number.isInteger(Number.parseInt(match[1]))) {
					channel = Number.parseInt(match[1])
				}
			}
		}

		client.nearby.message(message, channel, type)

		setInput("")
	}, [client, input])

	return (
		<Box flexDirection="column" gap={1}>
			<Static items={messages}>
				{(chat) => (
					<Text key={chat.id}>
						<Text {...getChatMessageProps(chat)} dimColor>
							{chat.fromName}
							{!chat.message.startsWith("/me ") &&
								!chat.message.startsWith("/me'") &&
								": "}
						</Text>
						<Text {...getChatMessageProps(chat)}>
							{chat.message.startsWith("/me'") && "'"}
							{chat.message.startsWith("/me ") && " "}
							{chat.message.replace(/^(\/me[ '])/, "")}
						</Text>
					</Text>
				)}
			</Static>

			<TextInput
				value={input}
				onChange={setInput}
				onSubmit={handleSubmit}
				placeholder="To nearby chat"
			/>
		</Box>
	)
}

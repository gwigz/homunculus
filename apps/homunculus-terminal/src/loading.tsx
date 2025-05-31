import { type Client, Constants } from "@gwigz/homunculus-core"
import { Box, Text } from "ink"
import Spinner from "ink-spinner"
import { useCallback, useEffect, useState } from "react"
import type { Message } from "./chat"

interface LoadingProps {
	client: Client
	onReady: (initialMessages: Message[]) => void
}

function formatDebugMessage(message: string) {
	return {
		id: crypto.randomUUID(),
		fromName: "[DEBUG]",
		chatType: Constants.ChatTypes.DEBUG,
		sourceType: Constants.ChatSources.SYSTEM,
		message: `/me ${message}`,
		timestamp: new Date().toLocaleTimeString(undefined, {
			hour: "2-digit",
			minute: "2-digit",
			hourCycle: "h24",
		}),
	} satisfies Message
}

export function Loading({ client, onReady }: LoadingProps) {
	const [initialMessages, setInitialMessages] = useState<Message[]>([])

	const handleDebug = useCallback((message: string) => {
		setInitialMessages((messages) => [...messages, formatDebugMessage(message)])
	}, [])

	const ready = useCallback(
		() => onReady([...initialMessages, formatDebugMessage("Connected!")]),
		[initialMessages, onReady],
	)

	useEffect(() => {
		client.on("ready", ready)
		client.on("debug", handleDebug)

		return () => {
			client.off("ready", ready)
			client.off("debug", handleDebug)
		}
	}, [client, handleDebug, ready])

	return (
		<Box flexDirection="column">
			<Box flexDirection="row">
				<Spinner type="dots" />
				<Text> Connecting to Second Life...</Text>
			</Box>

			<Box flexDirection="column" marginTop={1} marginBottom={1}>
				{initialMessages.map(({ id, message }) => (
					<Text key={id} color="gray">
						{message?.replace(/^\/me /, "")}
					</Text>
				))}
			</Box>
		</Box>
	)
}

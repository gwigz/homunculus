import { type Client, Constants } from "@gwigz/homunculus-core"
import { Box, Text } from "ink"
import Spinner from "ink-spinner"
import { useCallback, useEffect, useState } from "react"
import type { Message } from "./chat"

interface LoadingProps {
	client: Client
	onReady: (initialMessages: Message[]) => void
}

export function Loading({ client, onReady }: LoadingProps) {
	const [initialMessages, setInitialMessages] = useState<Message[]>([])

	const handleDebug = useCallback((message: string) => {
		// TODO: use a store for messages, this wont do once we have multiple routes
		setInitialMessages((messages) => [
			...messages,
			{
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
			} satisfies Message,
		])
	}, [])

	const ready = useCallback(
		() => onReady(initialMessages),
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

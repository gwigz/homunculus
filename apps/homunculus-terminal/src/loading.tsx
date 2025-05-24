import type { Client } from "@gwigz/homunculus-core"
import { Box, Text } from "ink"
import Spinner from "ink-spinner"
import { useEffect, useState } from "react"

interface LoadingProps {
	client: Client
	onReady: () => void
}

export function Loading({ client, onReady }: LoadingProps) {
	const [debug, setDebug] = useState<string[]>([])

	useEffect(() => {
		client.on("ready", onReady)

		client.on("debug", (message) => {
			setDebug((prev) => [...prev, message])
		})

		return () => {
			client.off("ready", onReady)
		}
	}, [client, onReady])

	return (
		<Box flexDirection="column">
			<Box flexDirection="row">
				<Spinner type="dots" />
				<Text> Connecting to Second Life...</Text>
			</Box>

			<Box flexDirection="column" marginTop={1} marginBottom={1}>
				{debug.map((message) => (
					<Text key={message} color="gray">
						{message}
					</Text>
				))}
			</Box>
		</Box>
	)
}

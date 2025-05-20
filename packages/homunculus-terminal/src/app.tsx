import assert from "node:assert"
import { randomUUID } from "node:crypto"
import { Client, Constants } from "@gwigz/homunculus-core"
import { Static, Text } from "ink"
import { useMemo, useState } from "react"

interface Props {
	start?: string
}

export default function App({ start = "last" }: Props) {
	const [chat, setChat] = useState<
		Array<{ key: string; name: string; message: string }>
	>([])

	// biome-ignore lint/correctness/useExhaustiveDependencies: sigh
	useMemo(() => {
		const client = new Client()

		client.nearby.on("chat", (chatter, message) => {
			if (chatter.type === Constants.ChatTypes.NORMAL) {
				setChat((chat) => [
					...chat,
					{ key: randomUUID(), name: chatter.name, message },
				])
			}
		})

		assert(process.env.USERNAME, "USERNAME env value is not set")
		assert(process.env.PASSWORD, "PASSWORD env value is not set")

		client.connect(process.env.USERNAME!, process.env.PASSWORD!, start)

		return client
	}, [])

	return (
		<Static items={chat}>
			{(message) => (
				<Text key={message.key}>
					{message.name}: {message.message}
				</Text>
			)}
		</Static>
	)
}

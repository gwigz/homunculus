import type { Client } from "@gwigz/homunculus-core"
import { useState } from "react"
import { Chat, type Message } from "./chat"
import { Loading } from "./loading"
import { Login } from "./login"

type AppState = "login" | "loading" | "chat"

export function App({ client, start }: { client: Client; start?: string }) {
	const [state, setState] = useState<AppState>("login")
	const [initialMessages, setInitialMessages] = useState<Message[]>([])

	async function handleLogin(username: string, password: string) {
		setState("loading")

		await client.connect(username, password, {
			login: { start },
		})
	}

	function handleReady(initialMessages: Message[]) {
		setInitialMessages(initialMessages)
		setState("chat")
	}

	async function handleExit() {
		await client.disconnect()

		process.exit(0)
	}

	return (
		<>
			{state === "login" && <Login onSubmit={handleLogin} />}

			{state === "loading" && <Loading client={client} onReady={handleReady} />}

			{state === "chat" && (
				<Chat
					client={client}
					initialMessages={initialMessages}
					onExit={handleExit}
				/>
			)}
		</>
	)
}

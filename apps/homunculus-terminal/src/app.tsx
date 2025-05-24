import { Client } from "@gwigz/homunculus-core"
import { useMemo, useState } from "react"
import { Chat } from "./chat"
import { Loading } from "./loading"
import { Login } from "./login"

type AppState = "login" | "loading" | "chat"

export function App() {
	const [state, setState] = useState<AppState>("login")
	const client = useMemo(() => new Client(), [])

	async function handleLogin(username: string, password: string) {
		setState("loading")

		await client.connect(username, password)
	}

	function handleReady() {
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
			{state === "chat" && <Chat client={client} onExit={handleExit} />}
		</>
	)
}

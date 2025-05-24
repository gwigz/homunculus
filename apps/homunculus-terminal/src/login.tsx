import { Box, Text, useInput } from "ink"
import BigText from "ink-big-text"
import TextInput from "ink-text-input"
import { useState } from "react"

interface LoginProps {
	onSubmit: (username: string, password: string) => Promise<void>
}

export function Login({ onSubmit }: LoginProps) {
	const [username, setUsername] = useState(process.env.SL_USERNAME || "")
	const [password, setPassword] = useState(process.env.SL_PASSWORD || "")

	const [isSubmitting, setIsSubmitting] = useState(false)

	const [activeField, setActiveField] = useState<"username" | "password">(
		"username",
	)

	useInput((_, key) => {
		if (key.escape) {
			process.exit(0)
		} else if (key.return) {
			if (activeField === "username" && password && !isSubmitting) {
				setIsSubmitting(true)
				onSubmit(username, password)
			} else if (activeField === "username") {
				setActiveField("password")
			} else if (
				activeField === "password" &&
				username &&
				password &&
				!isSubmitting
			) {
				setIsSubmitting(true)
				onSubmit(username, password)
			}
		} else if (key.tab || key.downArrow || key.upArrow) {
			setActiveField(activeField === "username" ? "password" : "username")
		}
	})

	return (
		<Box flexDirection="column">
			<Box flexDirection="column">
				<Box marginLeft={-1}>
					{/* @ts-ignore */}
					<BigText text="HOMUNCULUS" font="tiny" />
				</Box>

				<Text>
					Login to <Text bold>Second Life</Text>
				</Text>

				<Box marginTop={1}>
					<Text color="gray">Username </Text>
					<TextInput
						value={username}
						onChange={setUsername}
						placeholder="Enter username"
						focus={activeField === "username"}
					/>
				</Box>

				<Box marginBottom={1}>
					<Text color="gray">Password </Text>
					<TextInput
						value={password}
						onChange={setPassword}
						placeholder="Enter password"
						mask="*"
						focus={activeField === "password"}
					/>
				</Box>

				<Text color="gray" italic dimColor>
					Press tab or ↑/↓ to switch fields, enter to login, and escape to quit
				</Text>
			</Box>
		</Box>
	)
}

import {
	type Agent,
	type Client,
	Constants,
	type NearbyChatMessage,
} from "@gwigz/homunculus-core"
import { Box, type DOMElement, measureElement, Text, useInput } from "ink"
import TextInput from "ink-text-input"
import { useCallback, useEffect, useRef, useState } from "react"
import stripAnsi from "strip-ansi"
import { useScreenSize } from "./hooks"
import { logError } from "./logger"

export interface Message extends Partial<NearbyChatMessage> {
	timestamp: string
	id: string
}

const inaudibleChatTypes = [
	Constants.ChatTypes.TYPING_START,
	Constants.ChatTypes.TYPING_STOP,
] as number[]

const chatInputHeight = 3

interface ChatProps {
	client: Client
	initialMessages?: Message[]
	onExit: () => Promise<void>
}

export function Chat({ client, initialMessages = [], onExit }: ChatProps) {
	// TODO: use a store for messages, this wont do once we have multiple routes
	const [messages, setMessages] = useState<Message[]>(initialMessages)
	const [input, setInput] = useState("")
	const [nearbyInfo, setNearbyInfo] = useState<string[]>([])
	const [scrollTop, setScrollTop] = useState(0)
	const chatWrapperRef = useRef<DOMElement | null>(null)

	const [, terminalHeight] = useScreenSize(() => {
		const newTotalHeight = chatWrapperRef.current
			? measureElement(chatWrapperRef.current).height
			: 0

		setScrollTop(
			Math.max(0, newTotalHeight - (terminalHeight - chatInputHeight)),
		)
	})

	// calculate total scroll height and visible height
	const totalHeight = chatWrapperRef.current
		? measureElement(chatWrapperRef.current).height
		: 0

	const visibleHeight = terminalHeight - chatInputHeight

	// ensure scroll position is valid
	useEffect(() => {
		const maxScroll = Math.max(0, totalHeight - visibleHeight)

		setScrollTop((prev) => Math.min(prev, maxScroll))
	}, [totalHeight, visibleHeight])

	const addMessage = useCallback(
		(message: Partial<NearbyChatMessage>) => {
			if (!message.message?.length) {
				return
			}

			const timestamp = new Date().toLocaleTimeString(undefined, {
				hour: "2-digit",
				minute: "2-digit",
				hourCycle: "h24",
			})

			setMessages((prev) => {
				const newMessages = [
					...prev,
					{
						...message,
						timestamp,
						id: `${timestamp}-${Math.random().toString(36).slice(2)}`,
					},
				]

				// keep only the last 1000 messages
				if (newMessages.length > 1000) {
					newMessages.splice(0, newMessages.length - 1000)
				}

				// scroll to bottom after heights are measured
				setTimeout(() => {
					const newTotalHeight = chatWrapperRef.current
						? measureElement(chatWrapperRef.current).height
						: 0
					setScrollTop(Math.max(0, newTotalHeight - visibleHeight))
				}, 0)

				return newMessages
			})
		},
		[visibleHeight],
	)

	const updateNearbyInfo = useCallback(() => {
		const info: string[] = []

		for (const region of client.regions.values()) {
			if (region.name) {
				info.push(`\u001b[1m${region.name}\u001b[22m`)
			} else {
				info.push(`Loading... (\u001b[90m${region.handle}\u001b[39m)`)
			}

			for (const agent of region.agents.values()) {
				if (agent.key === client.self?.key) continue

				info.push(
					agent.name
						? agent.name
						: `Loading... (\u001b[90m${agent.key.slice(0, 8)}\u001b[39m)`,
				)
			}

			info.push("—")
			info.push(`${region.objects.size} objects`)
			info.push(`${region.agents.size - 1} avatars`)
		}

		setNearbyInfo(info)
	}, [client.regions, client.self?.key])

	const handleSubmit = useCallback(
		(untrimmedMessage: string) => {
			const message = untrimmedMessage.trim()

			if (!message) {
				return
			}

			setInput("")

			if (message === "/quit" || message === "/exit") {
				return void onExit()
			}

			if (message.startsWith("/")) {
				if (message.startsWith("/shout ")) {
					client.nearby.shout(message.substring(7))
				} else if (message.startsWith("/whisper ")) {
					client.nearby.whisper(message.substring(9))
				} else {
					const match = message.match(/^\/(\d+)/)
					let channel = 0

					if (match?.[1]) {
						const parsedChannel = Number.parseInt(match[1])

						if (parsedChannel >= 1) {
							channel = parsedChannel
						}
					}

					client.nearby.say(message, channel)
				}
			} else {
				client.nearby.say(message)
			}
		},
		[client.nearby, onExit],
	)

	useEffect(() => {
		function handleDebug(message: string) {
			addMessage({
				fromName: "[DEBUG]",
				message: `/me ${message}`,
				chatType: Constants.ChatTypes.DEBUG,
				sourceType: Constants.ChatSources.SYSTEM,
			})
		}

		function handleWarning(message: string) {
			addMessage({
				fromName: "[WARNING]",
				message: `/me ${message}`,
				sourceType: Constants.ChatSources.SYSTEM,
			})
		}

		function handleError(error: Error) {
			addMessage({
				fromName: "[ERROR]",
				message: `/me ${error.message}`,
				sourceType: Constants.ChatSources.SYSTEM,
			})

			logError(error)
		}

		function handleChat(chat: NearbyChatMessage) {
			if (!inaudibleChatTypes.includes(chat.chatType) && chat.message.length) {
				addMessage({
					fromName: chat.fromName,
					message: chat.message,
					chatType: chat.chatType,
					sourceType: chat.sourceType,
				})
			}

			updateNearbyInfo()
		}

		// HACK: we can't await the name yet, and we init them without any
		function waitForAgentName(agent: Agent, message: string) {
			let ticks = 0

			const timeout = setTimeout(() => {
				if (!agent.name) {
					++ticks

					// once we've waited for 3 seconds, we give up and show "(Loading...)"
					if (ticks < 30) {
						return
					}
				}

				clearTimeout(timeout)

				addMessage({
					fromName: agent.name ?? "(Loading...)",
					message: `/me ${message}`,
					chatType: Constants.ChatTypes.DEBUG,
					sourceType: Constants.ChatSources.SYSTEM,
				})
			}, 100)
		}

		function handleAgentSet(agent: Agent) {
			if (agent.key === client.self?.key) {
				return
			}

			waitForAgentName(agent, "entered the region.")
		}

		function handleAgentDelete(agent: Agent) {
			if (agent.key === client.self?.key) {
				return
			}

			waitForAgentName(agent, "left the region.")
		}

		client.on("debug", handleDebug)
		client.on("warn", handleWarning)
		client.on("error", handleError)

		client.nearby.on("chat", handleChat)

		client.region.agents.on("set", handleAgentSet)
		client.region.agents.on("delete", handleAgentDelete)

		function updateRegions() {
			for (const region of client.regions.values()) {
				region.agents.on("set", updateNearbyInfo)
				region.agents.on("delete", updateNearbyInfo)
			}
		}

		client.regions.on("set", updateRegions)
		client.regions.on("delete", updateRegions)

		return () => {
			client.off("debug", handleDebug)
			client.off("warn", handleWarning)
			client.off("error", handleError)

			client.nearby.off("chat", handleChat)
		}
	}, [client, addMessage, updateNearbyInfo])

	useEffect(() => {
		const interval = setInterval(updateNearbyInfo, 1000)

		return () => clearInterval(interval)
	}, [updateNearbyInfo])

	useInput((_, key) => {
		if (key.upArrow) {
			setScrollTop((prev) => Math.max(0, prev - 1))
		} else if (key.downArrow) {
			setScrollTop((prev) => Math.min(totalHeight - visibleHeight, prev + 1))
		} else if (key.pageUp) {
			setScrollTop((prev) => Math.max(0, prev - 10))
		} else if (key.pageDown) {
			setScrollTop((prev) => Math.min(totalHeight - visibleHeight, prev + 10))
		}
	})

	return (
		<Box flexDirection="column" height={terminalHeight - 1}>
			<Box flexGrow={1} flexDirection="row">
				<Box flexGrow={1} flexDirection="column" overflow="hidden">
					<Box
						ref={chatWrapperRef}
						flexShrink={0}
						flexDirection="column"
						marginTop={-scrollTop}
					>
						{messages.map((chat) => (
							<Text
								key={chat.id}
								italic={chat.chatType === Constants.ChatTypes.WHISPER}
								bold={chat.chatType === Constants.ChatTypes.SHOUT}
							>
								[{chat.timestamp}]{" "}
								<Text
									bold
									color={
										chat.chatType === Constants.ChatTypes.OWNERSAY
											? "yellow"
											: chat.sourceType === Constants.ChatSources.OBJECT
												? "green"
												: chat.sourceType === Constants.ChatSources.SYSTEM
													? "cyan"
													: undefined
									}
								>
									{stripAnsi(chat.fromName?.replace(/ Resident$/, "") ?? "")}
								</Text>
								{chat.chatType === Constants.ChatTypes.SHOUT
									? " shouts: "
									: chat.chatType === Constants.ChatTypes.WHISPER
										? " whispers: "
										: chat.message?.startsWith("/me ")
											? " "
											: chat.message?.startsWith("/me'")
												? "'"
												: ": "}
								<Text
									color={
										chat.chatType === Constants.ChatTypes.OWNERSAY
											? "yellow"
											: chat.sourceType === Constants.ChatSources.OBJECT
												? "green"
												: chat.sourceType === Constants.ChatSources.SYSTEM
													? "cyan"
													: undefined
									}
								>
									{stripAnsi(
										chat.message?.startsWith("/me ")
											? chat.message.substring(4)
											: chat.message?.startsWith("/me'")
												? chat.message.substring(4)
												: (chat.message ?? ""),
									)}
								</Text>
							</Text>
						))}
					</Box>
				</Box>

				<Box
					width={20}
					flexShrink={0}
					marginLeft={2}
					flexDirection="column"
					overflow="hidden"
				>
					{nearbyInfo.map((line, i) => (
						<Text key={`nearby-${i}-${line}`}>{line}</Text>
					))}
				</Box>
			</Box>

			<Box
				borderStyle="single"
				borderColor="gray"
				borderDimColor
				overflow="hidden"
				borderLeft={false}
				borderRight={false}
				borderBottom={false}
			>
				<TextInput
					value={input}
					onChange={setInput}
					onSubmit={handleSubmit}
					placeholder={'Type to nearby chat (↑/↓ to scroll, "/exit" to quit)'}
				/>
			</Box>
		</Box>
	)
}

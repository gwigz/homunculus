#!/usr/bin/env node

process.title = "homunculus"

import "dotenv/config"
import assert from "node:assert"
import { Client, Constants } from "@gwigz/homunculus-core"
import blessed from "blessed"
import meow from "meow"
import { createChat, setupChatHandlers } from "./components/chat"
import { loginForm } from "./components/login"
import { logError } from "./logger"

const cli = meow(
	`
	Usage
	  $ homunculus

	Options
		--start=<uri|last|home>

	Examples
	  $ homunculus --start="uri:Hippo Hollow&128&128&0"
`,
	{
		importMeta: import.meta,
		flags: {
			start: { type: "string" },
		},
	},
)

const start = cli.flags.start || process.env.SL_START

assert(
	start
		? /^(?:uri:[A-Za-z0-9 ]+&\d{1,3}&\d{1,3}&\d{1,4}|first|last)$/.test(start)
		: true,
	"SL_START env value is invalid",
)

const screen = blessed.screen({
	title: "Homunculus Terminal",
	smartCSR: true,
	dockBorders: true,
	grabKeys: true,
})

const client = new Client()

async function cleanup() {
	if (screen) {
		screen.destroy()
	}

	if (
		client.status !== Constants.Status.IDLE &&
		client.status !== Constants.Status.DISCONNECTED
	) {
		console.log("Disconnecting...")

		await client.disconnect()
		await new Promise((resolve) => setTimeout(resolve, 2000))
	}
}

async function exit() {
	try {
		await cleanup()
	} catch (error: unknown) {
		logError(error instanceof Error ? error : new Error(String(error)))

		console.error("Error during disconnect:", error)
	}

	process.exit(0)
}

screen.key(["escape"], async () => {
	await cleanup()

	process.exit(0)
})

process.on("uncaughtException", async (error) => {
	logError(error)

	await cleanup()

	console.error("Uncaught Exception:", error)
	process.exit(1)
})

process.on("unhandledRejection", async (reason) => {
	logError(reason instanceof Error ? reason : new Error(String(reason)))

	await cleanup()

	console.error("Unhandled Rejection:", reason)
	process.exit(1)
})

process.on("SIGINT", async () => await exit())
process.on("SIGTERM", async () => await exit())

loginForm(screen, async ({ username, password }) => {
	try {
		const components = createChat(screen)

		setupChatHandlers(screen, components, client, exit)

		screen.render()

		await client.connect(username, password, {
			login: { start },
		})
	} catch (error: unknown) {
		logError(error instanceof Error ? error : new Error(String(error)))

		await cleanup()

		console.error("Connection error:", error)
		process.exit(1)
	}
})

screen.render()

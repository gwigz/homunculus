#!/usr/bin/env node

process.title = "homunculus"

import "dotenv/config"
import { Client } from "@gwigz/homunculus-core"
import { render } from "ink"
import meow from "meow"
import { App } from "./app"
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

const client = new Client({ logger: false })

process.on("uncaughtException", async (error) => {
	logError(error)

	await client.disconnect()

	console.error("Uncaught Exception:", error)
	process.exit(1)
})

process.on("unhandledRejection", async (reason) => {
	logError(reason instanceof Error ? reason : new Error(String(reason)))

	await client.disconnect()

	console.error("Unhandled Rejection:", reason)
	process.exit(1)
})

render(<App client={client} start={start} />)

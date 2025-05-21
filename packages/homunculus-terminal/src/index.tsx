#!/usr/bin/env node
import assert from "node:assert"
import { render } from "ink"
import meow from "meow"
import { Client } from "../../homunculus-core/src"
import App from "./app"

const cli = meow(
	`
	Usage
	  $ homunculus

	Options
		--start=<uri|last|home>

	Examples
	  $ homunculus --start="uri:Bug Island&128&128&0"
`,
	{
		importMeta: import.meta,
		flags: {
			name: {
				type: "string",
			},
		},
	},
)

assert(process.env.USERNAME, "USERNAME env value is not set")
assert(process.env.PASSWORD, "PASSWORD env value is not set")

const start =
	typeof cli.flags.start === "string" ? cli.flags.start : process.env.START

assert(
	start
		? /^(?:uri:[A-Za-z0-9 ]+&\d{1,3}&\d{1,3}&\d{1,4}|first|last)$/.test(start)
		: true,
	"START env value is invalid",
)

const client = new Client()

render(<App client={client} start={start} />)

async function exit() {
	console.log("Shutting down...")

	await client.disconnect()

	process.exit(0)
}

process.on("SIGINT", exit)
process.on("SIGTERM", exit)

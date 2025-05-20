#!/usr/bin/env node
import { render } from "ink"
import meow from "meow"
import App from "./app"

const cli = meow(
	`
	Usage
	  $ homunculus

	Options
		--start=<uri|last|home>

	Examples
	  $ homunculus --start "uri:Bug Island&128&128&0"
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

render(<App start={(cli.flags.start as string) ?? process.env.START} />)

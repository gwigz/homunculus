import type { Client } from "@gwigz/homunculus-core"
import { ApiHandler } from "./api"
import { CommandHandler } from "./commands"

export interface BotOptions {
	commandPrefix: string
	apiPrefix?: string
	apiSeparator?: string
	apiChannel?: number
	onError?: (error: unknown) => void
}

export class Bot {
	private client: Client
	private commandHandler: CommandHandler
	private apiHandler: ApiHandler

	constructor(client: Client, options: BotOptions) {
		this.client = client

		this.commandHandler = new CommandHandler(client, options)
		this.apiHandler = new ApiHandler(client, options)

		this.client.nearby.on("chat", (message) => {
			this.commandHandler.handleMessage(message)
			this.apiHandler.handleMessage(message)
		})
	}

	get registerCommand() {
		return this.commandHandler.registerCommand
	}

	get registerApiHandler() {
		return this.apiHandler.registerHandler
	}
}

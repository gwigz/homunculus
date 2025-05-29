import type { Client } from "@gwigz/homunculus-core"
import type { ZodType } from "zod/v4"
import { ApiHandler, type ApiHandlerOptions } from "./api"
import { CommandHandler, type CommandHandlerOptions } from "./commands"

type Format = "json" | "string"

export interface BotOptions {
	commandPrefix: string
	apiPrefix?: string
	apiSeparator?: string
	apiChannel?: number
	onError?: ((error: unknown) => void) | false
}

export class Bot {
	private commandHandler: CommandHandler
	private apiHandler: ApiHandler

	constructor(client: Client, options: BotOptions) {
		this.commandHandler = new CommandHandler(client, options)
		this.apiHandler = new ApiHandler(client, options)

		client.nearby.on("chat", (chat) => {
			this.commandHandler.handleChatMessage(chat)
			this.apiHandler.handleChatMessage(chat)
		})
	}

	public registerCommand<
		F extends Format = "string",
		Schema extends ZodType<any, any> | undefined = undefined,
	>(command: CommandHandlerOptions<F, Schema>) {
		return this.commandHandler.registerCommand(command)
	}

	public registerApiHandler<
		F extends Format = "string",
		Schema extends ZodType<any, any> | undefined = undefined,
	>(handler: ApiHandlerOptions<F, Schema>) {
		return this.apiHandler.registerHandler(handler)
	}
}

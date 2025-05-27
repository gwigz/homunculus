import type { Client, NearbyChatMessage } from "@gwigz/homunculus-core"
import type { ZodType, z } from "zod"
import type { BotOptions } from "./bot"

type Format = "json" | "string"

type InferTypeFromFormat<F extends Format> = F extends "string"
	? string
	: unknown

type SchemaOutput<
	F extends Format,
	Schema extends ZodType<any, any, any> | undefined,
> = Schema extends undefined
	? InferTypeFromFormat<F>
	: z.infer<NonNullable<Schema>>

export interface CommandHandlerOptions<
	F extends Format = "json",
	Schema extends ZodType<any, any, any> | undefined = undefined,
> {
	action: string
	process: (
		client: Client,
		data: SchemaOutput<F, Schema>,
		message: NearbyChatMessage,
	) => Promise<string | void> | string | void
	format?: Schema extends undefined
		? F
		: Schema extends ZodType<any, any, string>
			? "string"
			: F
	schema?: Schema
}

export class CommandHandler {
	private client: Client
	private prefix: BotOptions["commandPrefix"]
	private commands = new Map<string, CommandHandlerOptions<any, any>>()

	private onError?: BotOptions["onError"]

	constructor(client: Client, options: BotOptions) {
		this.client = client
		this.prefix = options.commandPrefix
		this.commands
		this.onError = options.onError
	}

	public registerCommand<
		F extends Format = "json",
		Schema extends ZodType<any, any, any> | undefined = undefined,
	>(command: CommandHandlerOptions<F, Schema>) {
		this.commands.set(command.action, command)
	}

	public async handleMessage(message: NearbyChatMessage) {
		try {
			const [action, parameters] = message.message
				.slice(this.prefix.length)
				.split(" ", 1)

			if (!action) {
				return
			}

			const command = this.commands.get(action)

			if (command) {
				const response = await command.process(
					this.client,
					this.parseData(command, (parameters ?? "").trim()),
					message,
				)

				if (typeof response === "string" && response.length > 0) {
					this.client.nearby.say(response)
				}
			}
		} catch (error) {
			this.onError?.(error)
		}
	}

	private parseData<
		F extends Format,
		Schema extends ZodType<any, any, any> | undefined,
	>(
		handler: CommandHandlerOptions<F, Schema>,
		data: string,
	): SchemaOutput<F, Schema> {
		const parsed = handler.format === "string" ? data : JSON.parse(data)

		if (handler.schema) {
			return handler.schema.parse(parsed) as SchemaOutput<F, Schema>
		}

		return parsed as SchemaOutput<F, Schema>
	}
}

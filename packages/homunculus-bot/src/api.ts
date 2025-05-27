import {
	type Client,
	Constants,
	type NearbyChatMessage,
} from "@gwigz/homunculus-core"
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

export interface ApiHandlerOptions<
	F extends Format = "json",
	Schema extends ZodType<any, any, any> | undefined = undefined,
> {
	action: string
	process: (
		client: Client,
		data: SchemaOutput<F, Schema>,
	) => Promise<string | void> | string | void
	format?: Schema extends undefined
		? F
		: Schema extends ZodType<any, any, string>
			? "string"
			: F
	schema?: Schema
}

export class ApiHandler {
	private client: Client
	private prefix: NonNullable<BotOptions["apiPrefix"]>
	private separator: NonNullable<BotOptions["apiSeparator"]>
	private channel: NonNullable<BotOptions["apiChannel"]>
	private handlers = new Map<string, ApiHandlerOptions<any, any>>()

	private onError?: BotOptions["onError"]

	constructor(client: Client, options: BotOptions) {
		this.client = client
		this.prefix = options.apiPrefix ?? "#api"
		this.separator = options.apiSeparator ?? ","
		this.channel = options.apiChannel ?? -81513312
		this.onError = options.onError
	}

	public registerHandler<
		F extends Format = "json",
		Schema extends ZodType<any, any, any> | undefined = undefined,
	>(handler: ApiHandlerOptions<F, Schema>) {
		this.handlers.set(handler.action, handler)
	}

	public async handleMessage(chat: NearbyChatMessage) {
		if (
			chat.sourceType !== Constants.ChatSources.OBJECT ||
			chat.chatType !== Constants.ChatTypes.OWNERSAY ||
			!chat.message.startsWith(this.prefix)
		) {
			return
		}

		try {
			const [action, data] = chat.message
				.substring(this.prefix.length + 1)
				.split(this.separator, 2)

			if (!action) {
				return
			}

			const handler = this.handlers.get(action)

			if (handler) {
				const response = await handler.process(
					this.client,
					this.parseData(handler, data ?? ""),
				)

				if (typeof response === "string" && response.length > 0) {
					this.client.nearby.say(response, this.channel)
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
		handler: ApiHandlerOptions<F, Schema>,
		data: string,
	): SchemaOutput<F, Schema> {
		const parsed = handler.format === "string" ? data : JSON.parse(data)

		if (handler.schema) {
			return handler.schema.parse(parsed) as SchemaOutput<F, Schema>
		}

		return parsed as SchemaOutput<F, Schema>
	}
}

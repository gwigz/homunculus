import type { Client } from "~/client"

export class Friend {
	public online?: boolean

	/**
	 * @internal
	 */
	constructor(
		private readonly client: Client,
		public readonly key: string,
	) {}

	/**
	 * Send an instant message to the friend.
	 *
	 * @param message Message to send.
	 */
	public async message(message: string) {
		this.client.instantMessages.send(this.key, message)
	}
}

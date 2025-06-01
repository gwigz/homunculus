import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import type { Client } from "~/client"
import type { Friend } from "./friend"

export interface FriendEvents {
	set: [friend: Friend]
	delete: [friend: Friend]
}

export class Friends extends AsyncEventEmitter<FriendEvents> {
	private friends = new Map<string, Friend>()

	constructor(private readonly client: Client) {
		super()
	}

	public has(key: string) {
		return this.friends.has(key)
	}

	public get(key: string) {
		return this.friends.get(key)
	}

	public set(key: string, friend: Friend) {
		this.friends.set(key, friend)
		this.emit("set", friend)

		return this
	}

	public delete(key: string) {
		const friend = this.get(key)

		if (friend) {
			this.emit("delete", friend)
		}

		return this.friends.delete(key)
	}

	public entries() {
		return this.friends.entries()
	}

	public values() {
		return this.friends.values()
	}

	public keys() {
		return this.friends.keys()
	}

	public get size() {
		return this.friends.size
	}
}

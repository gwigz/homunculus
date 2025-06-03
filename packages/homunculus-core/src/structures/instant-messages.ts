import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import type { Client } from "~/client"
import { packets, UUID, Vector3 } from "~/network"
import type { InstantMessage } from "~/types"

export interface InstantMessageEvents {
	message: [data: InstantMessage]
}

export class InstantMessages extends AsyncEventEmitter<InstantMessageEvents> {
	/**
	 * @internal
	 */
	constructor(private readonly client: Client) {
		super()
	}

	public send(target: string, message: string, type?: InstantMessage["type"]) {
		return this.client.sendReliable([
			packets.improvedInstantMessage({
				messageBlock: {
					id: UUID.zero,
					dialog: type ?? 0,
					timestamp: 0,
					fromGroup: false,
					fromAgentName: this.client.self.name!,
					message: Buffer.from(`${message}\0`, "utf8"),
					toAgentId: target,
					offline: 0,
					parentEstateId: 0,
					regionId: UUID.zero,
					position: Vector3.zero,
					binaryBucket: "",
				},
			}),
		])
	}
}

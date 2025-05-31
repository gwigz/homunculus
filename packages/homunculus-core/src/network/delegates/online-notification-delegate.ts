import { packets } from "~/network"
import { Friend } from "~/structures/friend"

packets.createOnlineNotificationDelegate({
	handle: (packet, context) => {
		for (const { agentId: key } of packet.data.agentBlock ?? []) {
			const friend =
				context.client.friends.get(key) ?? new Friend(context.client, key)

			friend.online = true
			context.client.friends.set(key, friend)
		}
	},
})

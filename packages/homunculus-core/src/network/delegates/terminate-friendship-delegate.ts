import { packets } from "~/network"

packets.createTerminateFriendshipDelegate({
	handle: (packet, context) => {
		const key = packet.data.exBlock!.otherId!

		context.client.friends.delete(key)
	},
})

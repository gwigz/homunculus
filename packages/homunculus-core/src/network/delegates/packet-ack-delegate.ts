import { packets } from "~/network"

packets.createPacketAckDelegate({
	handle: (packet, context) => {
		for (const ack of packet.data.packets!) {
			context.core.circuit?.acknowledger.handleReceivedAck(ack.id)
		}
	},
})

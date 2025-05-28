import { packets } from "~/network"

packets.createStartPingCheckDelegate({
	handle: (packet, context) =>
		context.circuit.send([packets.completePingCheck(packet.data)]),
})

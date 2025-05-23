import type { PacketAck } from "../packets"
import Delegate from "./delegate"

class PacketAckDelegate extends Delegate {
	public handle(packet: PacketAck) {
		for (const ack of packet.data.packets) {
			this.core.circuit?.acknowledger.seen(ack.id)
		}
	}
}

export default PacketAckDelegate

import type { PacketAck } from "../packets"
import Delegate from "./delegate"

class PacketAckDelegate extends Delegate {
	public override handle(packet: PacketAck) {
		for (const ack of packet.data.packets!) {
			this.core.circuit?.acknowledger.handleReceivedAck(ack.id)
		}
	}
}

export default PacketAckDelegate

import type { PacketAck as PacketAckPacket } from "../packets"
import Delegate from "./delegate"

class PacketAck extends Delegate {
	public handle(packet: PacketAckPacket) {
		for (const ack of packet.data.packets) {
			this.core.circuit?.acknowledger.seen(ack.id)
		}
	}
}

export default PacketAck

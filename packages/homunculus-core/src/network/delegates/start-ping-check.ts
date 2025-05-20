import { CompletePingCheck, type Packet } from "../packets"
import Delegate from "./delegate"

class StartPingCheck extends Delegate {
	public handle(packet: Packet) {
		this.circuit.send(new CompletePingCheck(packet.data))
	}
}

export default StartPingCheck

import type { StartPingCheck as StartPingCheckPacket } from "../packets"
import { CompletePingCheck } from "../packets"
import Delegate from "./delegate"

class StartPingCheck extends Delegate {
	public handle(packet: StartPingCheckPacket) {
		this.circuit.send([new CompletePingCheck(packet.data)])
	}
}

export default StartPingCheck

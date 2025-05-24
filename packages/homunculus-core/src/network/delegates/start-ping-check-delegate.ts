import type { StartPingCheck } from "../packets"
import { CompletePingCheck } from "../packets"
import Delegate from "./delegate"

class StartPingCheckDelegate extends Delegate {
	public override handle(packet: StartPingCheck) {
		this.circuit.send([new CompletePingCheck(packet.data)])
	}
}

export default StartPingCheckDelegate

import { RegionHandshakeReply } from "../packets"
import Delegate from "./delegate"

class RegionHandshakeDelegate extends Delegate {
	public override handle() {
		this.client.emit("debug", "Region handshake complete...")

		this.circuit.send([
			new RegionHandshakeReply({ regionInfo: { flags: 1 | 4 } }),
		])
	}
}

export default RegionHandshakeDelegate

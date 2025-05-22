import { RegionHandshakeReply } from "../packets"
import Delegate from "./delegate"

class RegionHandshake extends Delegate {
	public handle() {
		this.client.emit("debug", "Region handshake complete...")

		this.circuit.send([
			new RegionHandshakeReply({ regionInfo: { flags: 1 | 4 } }),
		])
	}
}

export default RegionHandshake

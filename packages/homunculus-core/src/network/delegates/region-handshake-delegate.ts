import { type RegionHandshake, RegionHandshakeReply } from "~/network/packets"
import { Delegate } from "./delegate"

class RegionHandshakeDelegate extends Delegate {
	public override handle(packet: RegionHandshake) {
		this.client.emit("debug", "Region handshake complete...")

		this.client.self.isEstateManager =
			packet.data.regionInfo!.isEstateManager === true

		this.circuit.send([
			new RegionHandshakeReply({ regionInfo: { flags: 1 | 4 } }),
		])
	}
}

export default RegionHandshakeDelegate

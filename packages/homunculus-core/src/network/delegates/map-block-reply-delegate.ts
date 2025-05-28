import type { MapBlockReply } from "~/network/packets"
import Delegate from "./delegate"

class MapBlockReplyDelegate extends Delegate {
	public override handle(packet: MapBlockReply) {
		for (const data of packet.data.data!) {
			const x = data.x * 256
			const y = data.y * 256

			const handle = ((BigInt(x) << 32n) | BigInt(y)).toString()

			if (this.client.regions.has(handle)) {
				this.client.regions.get(handle)?.update({
					name: data.name.toString().slice(0, -1),
				})
			} else {
				this.client.emit(
					"error",
					new Error(
						`Received unexpected map reply for region "${data.name.toString().slice(0, -1)}".`,
					),
				)
			}
		}
	}
}

export default MapBlockReplyDelegate

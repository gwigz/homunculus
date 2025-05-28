import {
	createSocket,
	type RemoteInfo,
	type Socket as UdpSocket,
} from "node:dgram"
import { sharedServices } from "~/services"
import { Constants } from "~/utilities"
import type { Circuit } from "./circuit"
import type { Core } from "./core"

class Socket {
	private socket: UdpSocket

	constructor(
		/** Core instance that instantiated this Socket. */
		public readonly core: Core,
	) {
		this.socket = createSocket("udp4", this.receive.bind(this))
	}

	public send(circuit: Circuit, buffer: Buffer) {
		if (!(buffer instanceof Buffer)) {
			return Promise.resolve()
		}

		return new Promise<void>((resolve, reject) => {
			this.socket.send(buffer, circuit.port, circuit.address, (error) => {
				if (error) {
					this.core.client.emit(Constants.ClientEvents.ERROR, error)

					reject(error)
				}

				resolve()
			})
		})
	}

	public async receive(buffer: Buffer, info: RemoteInfo) {
		const circuit = this.core.circuits.get(`${info.address}:${info.port}`)

		if (circuit && buffer.length) {
			circuit.receive(sharedServices.deserializer.read(buffer))
		}
	}
}

export default Socket

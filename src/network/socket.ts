import {
	type RemoteInfo,
	type Socket as UDPSocket,
	createSocket,
} from "node:dgram"

import { Constants } from "../utilities"

import type Circuit from "./circuit"
import type Core from "./core"

class Socket {
	private socket: UDPSocket

	constructor(
		/** Core instance that instantiated this Socket. */
		public readonly core: Core,
	) {
		this.socket = createSocket("udp4", this.receive.bind(this))
	}

	public send(circuit: Circuit, buffer: Buffer): Promise<void> {
		if (!(buffer instanceof Buffer)) {
			return Promise.resolve()
		}

		return new Promise((resolve) => {
			this.socket.send(buffer, circuit.port, circuit.address, (error) => {
				if (error) {
					this.core.client.emit(Constants.ClientEvents.ERROR, error)
				}

				resolve()
			})
		})
	}

	public async receive(buffer: Buffer, info: RemoteInfo): Promise<void> {
		const circuit = this.core.circuits.get(`${info.address}:${info.port}`)

		if (circuit && buffer.length) {
			circuit.receive(circuit.deserializer.read(buffer))
		}
	}
}

export default Socket

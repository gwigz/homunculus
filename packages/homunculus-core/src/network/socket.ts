import assert from "node:assert"
import {
	createSocket,
	type RemoteInfo,
	type Socket as UdpSocket,
} from "node:dgram"
import type { Client } from "~/client"
import { services } from "~/services"
import { Constants } from "~/utilities"
import type { Circuit } from "./circuit"
import type { Core } from "./core"

export class Socket {
	private socket: UdpSocket

	constructor(
		private readonly client: Client,
		private readonly core: Core,
	) {
		this.socket = createSocket("udp4", this.receive.bind(this))
	}

	public send(circuit: Circuit, buffer: Buffer) {
		assert(buffer instanceof Buffer, "Invalid buffer")

		return new Promise<void>((resolve, reject) => {
			this.socket.send(buffer, circuit.port, circuit.address, (error) => {
				if (error) {
					this.client.emit(Constants.ClientEvents.ERROR, error)

					reject(error)
				}

				resolve()
			})
		})
	}

	public async receive(buffer: Buffer, info: RemoteInfo) {
		this.core.circuits
			.get(`${info.address}:${info.port}`)
			?.receive(services.deserializer.read(buffer))
	}

	public close() {
		this.socket.close()
	}
}

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

export interface ProxyOptions {
	host: string
	port: number
}

async function getSocksClient(proxy: ProxyOptions) {
	try {
		const { SocksClient } = await import("socks")

		const client = new SocksClient({
			proxy: { ...proxy, type: 5 },
			command: "associate",
			destination: { host: "0.0.0.0", port: 0 },
		})

		return new Promise<{
			remoteHost: { host: string; port: number }
			parseUdpFrame: typeof SocksClient.parseUDPFrame
			createUdpFrame: typeof SocksClient.createUDPFrame
		}>((resolve, reject) => {
			client.on("established", (info) => {
				if (!info.remoteHost) {
					return reject(new Error("Invalid remote host"))
				}

				resolve({
					remoteHost: info.remoteHost,
					parseUdpFrame: SocksClient.parseUDPFrame,
					createUdpFrame: SocksClient.createUDPFrame,
				})
			})

			client.connect()
		})
	} catch {
		throw new Error(
			'SOCKS5_PROXY configured but "socks" package not available, install "socks" package to enable proxy support',
		)
	}
}

type SocksClient = Awaited<ReturnType<typeof getSocksClient>>

export class Socket {
	private socket: UdpSocket
	private active = true
	private proxy?: ProxyOptions

	private remoteHost?: { host: string; port: number }
	private parseUdpFrame?: SocksClient["parseUdpFrame"]
	private createUdpFrame?: SocksClient["createUdpFrame"]

	constructor(
		private readonly client: Client,
		private readonly core: Core,
		proxy?: ProxyOptions,
	) {
		this.proxy = proxy
		this.socket = createSocket("udp4", this.receive.bind(this))
	}

	public async send(circuit: Circuit, buffer: Buffer) {
		assert(buffer instanceof Buffer, "Invalid buffer")

		if (!this.active) {
			return
		}

		if (this.proxy && !this.parseUdpFrame) {
			const helpers = await getSocksClient(this.proxy)

			this.remoteHost = helpers.remoteHost
			this.parseUdpFrame = helpers.parseUdpFrame
			this.createUdpFrame = helpers.createUdpFrame
		}

		return new Promise<void>((resolve, reject) => {
			this.socket.send(
				this.proxy
					? this.createUdpFrame!({
							remoteHost: { host: circuit.address, port: circuit.port },
							data: buffer,
						})
					: buffer,
				this.proxy ? this.remoteHost!.port : circuit.port,
				this.proxy ? this.remoteHost!.host : circuit.address,
				(error) => {
					if (error) {
						this.client.emit(Constants.ClientEvents.ERROR, error)

						return reject(error)
					}

					resolve()
				},
			)
		})
	}

	public async receive(buffer: Buffer, info: RemoteInfo) {
		if (this.proxy) {
			const { remoteHost, data } = this.parseUdpFrame!(buffer)

			this.core.circuits
				.get(`${remoteHost.host}:${remoteHost.port}`)
				?.receive(services.deserializer.read(data))
		} else {
			this.core.circuits
				.get(`${info.address}:${info.port}`)
				?.receive(services.deserializer.read(buffer))
		}
	}

	public close() {
		this.active = false
		this.socket.close()
	}
}

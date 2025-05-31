// initialize packets
import "./network/packets"

// initialize delegates
import "./services"
import "./network/delegates"

// export everything
export * from "./client"
export * from "./network/helpers/packet-buffer"
export * as packets from "./network/packets"
export type { Packet } from "./network/packets/packet"
export * from "./network/types"
export * from "./schema"
export type * from "./types"
export * from "./utilities"

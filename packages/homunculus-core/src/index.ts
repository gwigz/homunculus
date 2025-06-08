// initialize packets
import "./network/packets"

// initialize delegates
import "./network/delegates"

// export everything
export * from "./client"
export * from "./network/helpers/packet-buffer"
export type { Packet } from "./network/packet"
export * as packets from "./network/packets"
export * from "./network/types"
export * from "./schema"
export type * from "./types"
export * from "./utilities"

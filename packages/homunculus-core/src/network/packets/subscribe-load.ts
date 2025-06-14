/**
 * SubscribeLoad Packet
 *
 * This file is used to help our packet serialization and deserialization
 * process, and to create new packets on the fly.
 *
 * ⚠️ Do not edit this file manually, it is generated by the `codegen` script!
 *
 * @see {@link http://wiki.secondlife.com/wiki/Message_Layout}
 */

import {
	createPacketDelegate,
	createPacketSender,
	type PacketMetadata,
} from "../packet"

export type SubscribeLoadData = Record<string, never>

export const subscribeLoadMetadata = {
	id: 7,
	name: "SubscribeLoad",
	frequency: 2,
	trusted: true,
} satisfies PacketMetadata

export const subscribeLoad = createPacketSender<SubscribeLoadData>(
	subscribeLoadMetadata,
)

export const createSubscribeLoadDelegate =
	createPacketDelegate<SubscribeLoadData>(subscribeLoadMetadata)

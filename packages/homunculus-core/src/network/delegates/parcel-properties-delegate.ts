import { packets } from "~/network"

packets.createParcelPropertiesDelegate({
	handle: (packet, context) => {
		const data = packet.data.parcelData!
		const self = context.client.self

		const sequenceId = data.sequenceId

		// agent parcel update
		if (sequenceId === 0 || sequenceId > self.lastParcelSequenceId) {
			self.updateParcelProperties(packet.data)
		}
	},
})

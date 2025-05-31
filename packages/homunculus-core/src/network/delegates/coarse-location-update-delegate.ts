import { packets, Vector3 } from "~/network"

packets.createCoarseLocationUpdateDelegate({
	handle: (packet, context) =>
		context.region.handleCoarseLocationUpdates(
			packet.data.agentData!.reduce((agents, { agentId }, index) => {
				const position = packet.data.location![index]

				if (position) {
					agents.set(
						agentId!,
						new Vector3(
							position.x,
							position.y,
							// if Z is 255, then we have no idea what their Z coordinate might be
							// use MAX_SAFE_INTEGER to play "safe" with distance calculations
							position.z === 255
								? Number.MAX_SAFE_INTEGER
								: // Z is compressed, so we need to multiply by 4...
									position.z * 4,
						),
					)
				}

				return agents
			}, new Map<string, Vector3>()),
		),
})

import type { Client } from "~/client"

/**
 * Represents the agents camera, which contains and controls camera position
 * known to the connected region/simulator.
 */
export class Camera {
	constructor(
		/** The Client that instantiated this Camera object. */
		private readonly client: Client,
	) {}
}

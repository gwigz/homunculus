import type { Client } from ".."

/**
 * Represents the agents camera, which contains and controls camera position
 * known to the connected region/simulator.
 */
class Camera {
	constructor(
		/** The Client that instantiated this Camera object. */
		public readonly client: Client,
	) {}
}

export default Camera

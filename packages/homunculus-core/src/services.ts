import { Authenticator } from "~/network/authenticator"
import { Deserializer } from "~/network/deserializer"

// shared stateless services that can be reused across multiple clients
export const sharedServices = {
	authenticator: new Authenticator("homunculus", "0.0.0"),
	deserializer: new Deserializer(),
}

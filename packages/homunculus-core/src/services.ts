import { Authenticator, Delegate, Deserializer } from "./network"

// shared stateless services that can be reused across multiple clients
export const services = {
	authenticator: new Authenticator("homunculus", "0.0.0"),
	deserializer: new Deserializer(),
	delegate: new Delegate(),
}

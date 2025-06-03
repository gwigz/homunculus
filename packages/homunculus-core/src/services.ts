/** biome-ignore-all lint/suspicious/noAssignInExpressions: wip */
import { Authenticator, Delegate, Deserializer } from "./network"

let deserializer: Deserializer | undefined
let delegate: Delegate | undefined

// shared stateless services that can be reused across multiple clients
export const services = {
	authenticator: new Authenticator("homunculus", "0.0.0"),
	get deserializer() {
		return (deserializer ??= new Deserializer())
	},
	get delegate() {
		return (delegate ??= new Delegate())
	},
}

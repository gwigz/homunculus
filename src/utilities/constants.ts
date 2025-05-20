export const ClientEvents = {
	DEBUG: "debug",
	WARNING: "warning",
	ERROR: "error",
	READY: "ready",
} as const

export const Errors = {
	NOT_CONNECTED: "Not connected, cannot process request.",
	ALREADY_CONNECTED: "Client is already connected, disconnect first.",
	INVALID_LOGIN: "Username or password is not string type.",
	BAD_LOGIN: "Incorrect login details were provided.",
	LOGIN_FAILED:
		"Login failed, may be due to bad credentials, pending logout, or external factors.",
	UNKNOWN_PACKET_ID:
		"Unknown packet, needs to be defined within the packets utility file, and tested if nessecery: ",
	INACTIVE_CIRCUIT: "Cannot send packets over inactive circuit.",
	HANDSHAKE_ACTIVE_CIRCUIT: "Cannot send handshake to active circuit.",
	MISSING_BLOCK: "Missing packet block, packet will not be sent.",
	INVALID_BLOCK_QUANTITY:
		"Quantity requirement of packet block not met or above 255, packet will not be sent.",
	MISSING_PARAMETER: "Missing packet parameters, packet will not be sent.",
	INVALID_PARAMETER_TYPE: "Method parameter invalid.",
	UNEXPECTED_OBJECT_UPDATE: "Recieved object update for unknown region!",
	UNEXPECTED_OBJECT_UPDATE_LENGTH: "Unexpected object update length!",
} as const

export const Status = {
	READY: 0,
	CONNECTING: 1,
	RECONNECTING: 2,
	IDLE: 3,
	DISCONNECTED: 4,
} as const

export const Endpoints = {
	LOGIN_URL: "https://login.agni.lindenlab.com/cgi-bin/login.cgi",
} as const

export const ChatSources = {
	SYSTEM: 0,
	AGENT: 1,
	OBJECT: 2,
} as const

export const ChatTypes = {
	WHISPER: 0,
	NORMAL: 1,
	SHOUT: 2,
	SAY: 3,
	TYPING: 4,
	STOPPED: 5,
	DEBUG: 6,
	OWNERSAY: 8,
} as const

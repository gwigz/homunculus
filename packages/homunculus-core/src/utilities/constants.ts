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
	INVALID_START: "Start value is not valid.",
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

export const ControlFlags = {
	NONE: 0x00000000,
	AT_POS: 0x00000001,
	AT_NEG: 0x00000002,
	LEFT_POS: 0x00000004,
	LEFT_NEG: 0x00000008,
	UP_POS: 0x00000010,
	UP_NEG: 0x00000020,
	PITCH_POS: 0x00000040,
	PITCH_NEG: 0x00000080,
	YAW_POS: 0x00000100,
	YAW_NEG: 0x00000200,
	FAST_AT: 0x00000400,
	FAST_LEFT: 0x00000800,
	FAST_UP: 0x00001000,
	FLY: 0x00002000,
	STOP: 0x00004000,
	FINISH_ANIM: 0x00008000,
	STAND_UP: 0x00010000,
	SIT_ON_GROUND: 0x00020000,
	MOUSELOOK: 0x00040000,
	NUDGE_AT_POS: 0x00080000,
	NUDGE_AT_NEG: 0x00100000,
	NUDGE_LEFT_POS: 0x00200000,
	NUDGE_LEFT_NEG: 0x00400000,
	NUDGE_UP_POS: 0x00800000,
	NUDGE_UP_NEG: 0x01000000,
	TURN_LEFT: 0x02000000,
	TURN_RIGHT: 0x04000000,
	AWAY: 0x08000000,
	LBUTTON_DOWN: 0x10000000,
	LBUTTON_UP: 0x20000000,
	ML_LBUTTON_DOWN: 0x40000000,
	ML_LBUTTON_UP: 0x80000000,
} as const

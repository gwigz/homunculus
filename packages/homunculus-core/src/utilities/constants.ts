export const ClientEvents = {
	DEBUG: "debug",
	WARNING: "warning",
	ERROR: "error",
	READY: "ready",
	CONNECTING: "connecting",
	RECONNECTING: "reconnecting",
	DISCONNECTING: "disconnecting",
	DISCONNECTED: "disconnected",
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
	MISSING_BLOCK: "Missing packet block (%s), packet will not be sent.",
	INVALID_BLOCK_QUANTITY:
		"Quantity requirement of packet block not met or above 255, packet will not be sent.",
	MISSING_PARAMETER: "Missing packet parameter (%s), packet will not be sent.",
	INVALID_PARAMETER_TYPE: "Method parameter invalid.",
	UNEXPECTED_OBJECT_UPDATE: "Recieved object update for unknown region!",
	UNEXPECTED_OBJECT_UPDATE_LENGTH: "Unexpected object update length!",
} as const

export const Status = {
	READY: 0,
	CONNECTING: 1,
	RECONNECTING: 2,
	DISCONNECTING: 3,
	IDLE: 4,
	DISCONNECTED: 5,
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
	/** @deprecated use `TYPING_START` instead */
	TYPING: 4,
	/** @deprecated use `TYPING_STOP` instead */
	STOPPED: 5,
	TYPING_START: 4,
	TYPING_STOP: 5,
	DEBUG: 6,
	/** @deprecated use `OWNER_SAY` instead */
	OWNERSAY: 8,
	OWNER_SAY: 8,
} as const

export const InstantMessageTypes = {
	NORMAL: 0,
	DO_NOT_DISTURB_AUTO_RESPONSE: 20,
	TYPING_START: 41,
	TYPING_STOP: 42,
} as const

export const AgentStates = {
	NONE: 0x0,
	TYPING: 0x4,
	EDITING: 0x10,
} as const

/**
 * @see {@link https://wiki.secondlife.com/wiki/How_movement_works}
 */
export const ControlFlags = {
	NONE: 0x0,
	AT_POS: 0x1,
	AT_NEG: 0x2,
	LEFT_POS: 0x4,
	LEFT_NEG: 0x8,
	UP_POS: 0x10,
	UP_NEG: 0x20,
	PITCH_POS: 0x40,
	PITCH_NEG: 0x80,
	YAW_POS: 0x100,
	YAW_NEG: 0x200,
	FAST_AT: 0x400,
	FAST_LEFT: 0x800,
	FAST_UP: 0x1000,
	FLY: 0x2000,
	STOP: 0x4000,
	FINISH_ANIM: 0x8000,
	STAND_UP: 0x10000,
	SIT_ON_GROUND: 0x20000,
	MOUSELOOK: 0x40000,
	NUDGE_AT_POS: 0x80000,
	NUDGE_AT_NEG: 0x100000,
	NUDGE_LEFT_POS: 0x200000,
	NUDGE_LEFT_NEG: 0x400000,
	NUDGE_UP_POS: 0x800000,
	NUDGE_UP_NEG: 0x1000000,
	TURN_LEFT: 0x2000000,
	TURN_RIGHT: 0x4000000,
	AWAY: 0x8000000,
	LBUTTON_DOWN: 0x10000000,
	LBUTTON_UP: 0x20000000,
	ML_LBUTTON_DOWN: 0x40000000,
	ML_LBUTTON_UP: 0x80000000,
} as const

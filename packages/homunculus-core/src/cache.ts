import KeyvSqlite from "@keyv/sqlite"
import Keyv from "keyv"

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

export const cache = new Keyv(
	process.env.DB_FILE_NAME
		? new KeyvSqlite(process.env.DB_FILE_NAME)
		: undefined,
	{ ttl: THIRTY_DAYS },
)

export interface AvatarCache {
	firstName: string
	lastName?: string
	lastUpdated: number
}

export interface RegionCache {
	name: string
	lastUpdated: number
}

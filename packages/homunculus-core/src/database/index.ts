import assert from "node:assert"
import { drizzle } from "drizzle-orm/bun-sqlite"

assert(process.env.DB_FILE_NAME, "DB_FILE_NAME env value is not set")

export const db = drizzle(process.env.DB_FILE_NAME)

export * as schema from "./schema"

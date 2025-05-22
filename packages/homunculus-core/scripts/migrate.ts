import assert from "node:assert"
import { Database } from "bun:sqlite"
import { drizzle } from "drizzle-orm/bun-sqlite"
import { migrate } from "drizzle-orm/bun-sqlite/migrator"

assert(process.env.DB_FILE_NAME, "DB_FILE_NAME env value is not set")

const sqlite = new Database(process.env.DB_FILE_NAME)
const db = drizzle(sqlite)

migrate(db, { migrationsFolder: "./drizzle" })

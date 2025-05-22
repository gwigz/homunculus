import path from "path"
import { drizzle } from "drizzle-orm/bun-sqlite"
import { migrate } from "drizzle-orm/bun-sqlite/migrator"

export const db = drizzle(process.env.DB_FILE_NAME ?? ":memory:")

migrate(db, {
	migrationsFolder: path.join(import.meta.dir, "..", "..", "drizzle"),
})

export * as schema from "./schema"

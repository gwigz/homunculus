import assert from "node:assert"
import { defineConfig } from "drizzle-kit"

assert(process.env.DB_FILE_NAME, "DB_FILE_NAME env value is not set")

export default defineConfig({
	out: "./src/database/migrations",
	schema: "./src/database/schema.ts",
	dialect: "sqlite",
	dbCredentials: { url: process.env.DB_FILE_NAME },
})

import { int, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core"

const lastUpdated = int("last_updated")
	.notNull()
	.$defaultFn(() => Date.now())
	.$onUpdateFn(() => Date.now())

export const avatars = sqliteTable(
	"avatars",
	{
		id: int().primaryKey({ autoIncrement: true }),
		key: text().notNull().unique(),
		firstName: text("first_name"),
		lastName: text("last_name"),
		lastUpdated,
	},
	(table) => [uniqueIndex("key_idx").on(table.key)],
)

export const regions = sqliteTable(
	"regions",
	{
		id: int().primaryKey({ autoIncrement: true }),
		handle: text("handle").notNull().unique(),
		name: text("name"),
		lastUpdated,
	},
	(table) => [uniqueIndex("handle_idx").on(table.handle)],
)

import fs from "node:fs"
import path from "node:path"

const logFile = path.join(import.meta.dirname, "homunculus-error.log")

export function logError(error: Error | string) {
	const timestamp = new Date().toISOString()
	const message = error instanceof Error ? error.stack || error.message : error

	fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`)
}

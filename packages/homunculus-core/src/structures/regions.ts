import assert from "node:assert"
import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import type { Region } from "./region"

export interface RegionsEvents {
	connect: [region: Region]
	disconnect: [handle: string]
}

export class Regions extends AsyncEventEmitter<RegionsEvents> {
	private regions = new Map<string, Region>()
	private currentRegion?: Region

	public has(handle: string | number | bigint) {
		return this.regions.has(handle.toString())
	}

	public get(handle: string | number | bigint) {
		return this.regions.get(handle.toString())
	}

	public set(handle: string | number | bigint, region: Region) {
		if (!this.currentRegion) {
			this.currentRegion = region
		}

		this.regions.set(handle.toString(), region)
		this.emit("connect", region)

		return this
	}

	public delete(handle: string | number | bigint) {
		this.emit("disconnect", handle.toString())

		return this.regions.delete(handle.toString())
	}

	public entries() {
		return this.regions.entries()
	}

	public values() {
		return this.regions.values()
	}

	public keys() {
		return this.regions.keys()
	}

	public get current() {
		assert(this.currentRegion, "Current region is not initialized")

		return this.currentRegion
	}

	public get size() {
		return this.regions.size
	}
}

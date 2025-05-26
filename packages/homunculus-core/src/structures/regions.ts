import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter"
import type Region from "./region"

export interface RegionsEvents {
	set: [region: Region]
	delete: [handle: string]
}

class Regions extends AsyncEventEmitter<RegionsEvents> {
	private regions = new Map<string, Region>()

	public has(handle: string | number | bigint) {
		return this.regions.has(handle.toString())
	}

	public get(handle: string | number | bigint) {
		return this.regions.get(handle.toString())
	}

	public set(handle: string | number | bigint, region: Region) {
		this.regions.set(handle.toString(), region)
		this.emit("set", region)

		return this
	}

	public delete(handle: string | number | bigint) {
		this.emit("delete", handle.toString())

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

	public get size() {
		return this.regions.size
	}
}

export default Regions

import type { PacketBuffer } from "~/network/helpers"
import type { Type } from "~/network/types"

export type CompressedObjectProperties = Array<
	[key: string, type: Type | CompressedObjectValue]
>

export class CompressedObjectValue {
	private type: any
	private flag: number
	private placeholder?: any

	constructor(type: any, flag: number, placeholder?: any) {
		this.type = type
		this.flag = flag
		this.placeholder = placeholder
	}

	public read(buffer: PacketBuffer, flags: number) {
		if (flags & this.flag) {
			return buffer.read(this.type)
		}

		return this.placeholder
	}
}

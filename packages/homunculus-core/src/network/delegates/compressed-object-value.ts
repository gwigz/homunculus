import type PacketBuffer from "../helpers/packet-buffer"
import type { Type } from "../types"

class CompressedObjectValue {
	private type: any
	private flag: number

	constructor(type: any, flag: number) {
		this.type = type
		this.flag = flag
	}

	public read(buffer: PacketBuffer, flags: number) {
		if (flags & this.flag) {
			return buffer.read(this.type)
		}

		return
	}
}

export default CompressedObjectValue

export type CompressedObjectProperties = Array<
	[key: string, type: Type | CompressedObjectValue]
>

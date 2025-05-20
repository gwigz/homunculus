import type PacketBuffer from "../helpers/packet-buffer"
import type { Type } from "../types"

class CompressedObjectValue {
	private type: any
	private flag: number

	constructor(type: any, flag: number) {
		this.type = type
		this.flag = flag
	}

	public read(buffer: PacketBuffer, _flags: number) {
		// if (this.flag && !(flags & this.flag)) {
		//   return this.preset
		// }

		return buffer.read(this.type)
	}
}

export default CompressedObjectValue

export type CompressedObjectProperties = Array<
	[key: string, type: Type | CompressedObjectValue]
>

import type * as Types from "~/model/types"
import type { Primitive } from "./primitive"
import { U16 } from "./u16"

export const Port = {
	MAX_VALUE: 65535 as Types.Port,
	MIN_VALUE: 0 as Types.Port,
	size: () => U16.size(),
	encode: (value, buffer, offset) => U16.encode(value, buffer, offset),
	decode: (buffer, state) => U16.decode(buffer, state) as Types.Port,
} as const satisfies Primitive<Types.Port>

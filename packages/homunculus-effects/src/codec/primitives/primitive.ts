import type { Buffer } from "node:buffer"

export interface Primitive<A> {
	MAX_VALUE?: A
	MIN_VALUE?: A

	size: (value?: A) => number

	encode: (value: A, target: Buffer, offset: number) => number
	decode: (source: Buffer, state: { offset: number }) => A
}

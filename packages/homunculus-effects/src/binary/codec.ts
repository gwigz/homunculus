import type { Buffer } from "node:buffer"

export interface Codec<A> {
	MAX_VALUE?: A
	MIN_VALUE?: A
	size: (value?: A) => number
	encode: (value: A, target: Buffer, offset: number) => void
	decode: (source: Buffer, offset: number) => [value: A, offset: number]
}

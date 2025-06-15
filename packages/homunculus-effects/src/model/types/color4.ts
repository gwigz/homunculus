import { Data } from "effect"

export interface Color4 {
	readonly _tag: "Color4"
	readonly r: number
	readonly g: number
	readonly b: number
	readonly a: number
}

export const Color4 = Data.tagged<Color4>("Color4")

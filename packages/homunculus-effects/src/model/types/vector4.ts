import { Data } from "effect"

export interface Vector4 {
	readonly _tag: "Vector4"
	readonly x: number
	readonly y: number
	readonly z: number
	readonly w: number
}

export const Vector4 = Data.tagged<Vector4>("Vector4")

import { Data } from "effect"

export interface Vector3 {
	readonly _tag: "Vector3"
	readonly x: number
	readonly y: number
	readonly z: number
	readonly w: number
}

export const Vector3 = Data.tagged<Vector3>("Vector3")

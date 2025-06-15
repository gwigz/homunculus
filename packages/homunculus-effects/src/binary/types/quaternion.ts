import { Data } from "effect"

export interface Quaternion {
	readonly _tag: "Quaternion"
	readonly x: number
	readonly y: number
	readonly z: number
	readonly w: number
}

export const Quaternion = Data.tagged<Quaternion>("Quaternion")

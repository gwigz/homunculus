import type { Vector3 } from "./network"

export type { Agent, Entity, Region } from "./structures"

export interface NearbyChatMessage {
	fromName: string
	source: string
	owner: string
	sourceType: number
	/** @deprecated use `type` instead */
	chatType: number
	type: number
	audible: number
	position: Vector3
	message: string
}

export interface InstantMessage {
	id: string
	timestamp: number
	type: number
	source: string
	name: string
	message: string
	isOfflineMessage?: boolean
}

export type CollisionTypeLabel =
	| "invalid"
	| "bump"
	| "scripted-push"
	| "selected-object"
	| "scripted-object"
	| "physical-object"

export interface Collision {
	/** Key of the object or avatar that caused the collision */
	source: string
	/** Timestamp of the collision */
	timestamp: number
	/** Magnitude of the collision */
	magnitude: number
	/** Type of the collision */
	type: CollisionTypeLabel
}

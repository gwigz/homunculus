// NOTE: you would normally import from "@gwigz/homunculus-core"
import { Client, Constants, Quaternion } from "../src"

const client = new Client()
const controls = Object.values(Constants.ControlFlags)

let angle = 0
let sitting = false

setInterval(() => {
	if (client.status !== Constants.Status.READY) {
		return
	}

	const self = client.self!

	/**
	 * @see {@link https://wiki.secondlife.com/wiki/How_movement_works}
	 */
	self.controlFlags = controls[Math.floor(Math.random() * controls.length)]!

	// stand instead, if we recently sat
	if (self.controlFlags & Constants.ControlFlags.SIT_ON_GROUND) {
		sitting = true
	} else if (sitting) {
		sitting = false
		self.controlFlags = Constants.ControlFlags.STAND_UP
	}
}, 1000)

setInterval(() => {
	if (client.status !== Constants.Status.READY) {
		return
	}

	const self = client.self!

	angle += 0.1

	const cos = Math.cos(angle / 2)
	const sin = Math.sin(angle / 2)

	self.rotation = new Quaternion(0, 0, sin, cos)
	self.sendAgentUpdate()
}, 100)

client.connect()

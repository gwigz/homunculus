import { Constants } from "../../utilities"
import { PacketBuffer } from "../helpers"
import {
	type ImprovedTerseObjectUpdate,
	RequestMultipleObjects,
} from "../packets"
import * as Types from "../types"
import Delegate from "./delegate"

class ImprovedTerseObjectUpdateDelegate extends Delegate {
	public override handle(packet: ImprovedTerseObjectUpdate) {
		const handle = packet.data.regionData!.regionHandle
		const region = this.client.regions.get(handle)

		if (!region) {
			throw Error(Constants.Errors.UNEXPECTED_OBJECT_UPDATE)
		}

		const missing = [] as number[]

		for (const { data } of packet.data.objectData!) {
			const buffer = new PacketBuffer(data as Buffer, true)

			if (buffer.length !== 44 && buffer.length !== 60) {
				throw Error(Constants.Errors.UNEXPECTED_OBJECT_UPDATE_LENGTH)
			}

			const id = buffer.read(Types.U32)
			const entity = region.objects.get(id)

			if (!entity) {
				missing.push(id)

				continue
			}

			entity.state = buffer.read(Types.U8)

			// next byte defines if this update is for an avatar or not
			if (buffer.read(Types.Bool)) {
				// this contains a normal and Z position for the avatars foot shadow,
				// we don't use these at the moment for anything, so don't include them
				// for now...
				buffer.read(Types.Vector4)
			}

			entity.position = buffer.read(Types.Vector3)
			entity.velocity = buffer.read(Types.Vector3, Types.U16, -128, 128)
			entity.acceleration = buffer.read(Types.Vector3, Types.U16, -64, 64)

			entity.rotation = buffer.read(
				Types.Quaternion,
				false,
				Types.U16,
				-1.0,
				1.0,
			)

			entity.angularVelocity = buffer.read(
				Types.Vector3,
				Types.U16,
				-64.0,
				64.0,
			)

			if (entity.type === 47 && entity.key === this.client.self.key) {
				this.client.self.state = entity.state
				this.client.self.position = entity.position!
				this.client.self.rotation = entity.rotation!
			}
		}

		for (let i = 0; i < missing.length; i += 255) {
			this.circuit.send([
				new RequestMultipleObjects({
					objectData: missing.slice(i, i + 255).map((id) => ({
						id,
						cacheMissType: 0,
					})),
				}),
			])
		}
	}
}

export default ImprovedTerseObjectUpdateDelegate

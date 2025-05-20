import { RegionHandshakeReply } from "../packets"
import Delegate from "./delegate"

class RegionHandshake extends Delegate {
	public handle(): void {
		// RegionInfo
		// { RegionFlags U32 }
		// { SimAccess U8 }
		// { SimName Variable1 } // string
		// { SimOwner UUID }
		// { IsEstateManager BOOL } // this agent, for this sim

		// RegionInfo2
		// { RegionID UUID }

		// RegionInfo3 Single
		// { CPUClassID S32 }
		// { CPURatio S32 }
		// { ColoName Variable1 } // string
		// { ProductSKU Variable1 } // string
		// { ProductName Variable1 } // string

		// TODO: add toggle for this, if we don't want objects dont send this
		this.circuit.send(
			new RegionHandshakeReply({
				regionInfo: {
					// Set to support self appearance.
					flags: 0x0100,
				},
			}),
		)

		// Notify the core that we're connected.
		this.circuit.core.ready()
	}
}

export default RegionHandshake

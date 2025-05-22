import type { RegionHandshake as RegionHandshakePacket } from "../packets"
import { RegionHandshakeReply } from "../packets"
import Delegate from "./delegate"

class RegionHandshake extends Delegate {
	public handle(_packet: RegionHandshakePacket) {
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

		// TODO: add toggle for this, if we don't want objects don't send this
		this.circuit.send(
			// set to support self appearance
			new RegionHandshakeReply({ regionInfo: { flags: 1 | 4 } }),
		)

		// notify the core that we're connected
		this.circuit.core.ready()
	}
}

export default RegionHandshake

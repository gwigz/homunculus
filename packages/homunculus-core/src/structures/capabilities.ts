import z from "zod/v4"
import type { Client } from "~/client"
import { LLSD } from "~/network/helpers/llsd"
import { mapEventQueuePacketData } from "~/network/packet"
import {
	type ParcelPropertiesData,
	parcelPropertiesMetadata,
} from "~/network/packets/parcel-properties"
import { EventQueue, type EventQueueMessage } from "./event-queue"

export class Capabilities {
	public readonly capabilities = new Map<string, string>()
	private readonly contentType = "application/llsd+xml"
	private eventQueue: EventQueue | undefined = undefined

	constructor(
		private readonly client: Client,
		private readonly seedCapabilityUrl: string,
	) {
		// TODO: pass errors down to the client
		this.init()
	}

	private async init() {
		const capabilities = [
			"AbuseCategories",
			"AcceptFriendship",
			"AcceptGroupInvite",
			"AgentExperiences",
			"AgentPreferences",
			"AgentProfile",
			"AgentState",
			"AttachmentResources",
			"AvatarPickerSearch",
			"AvatarRenderInfo",
			"CharacterProperties",
			"ChatSessionRequest",
			"CopyInventoryFromNotecard",
			"CreateInventoryCategory",
			"DeclineFriendship",
			"DeclineGroupInvite",
			"DirectDelivery",
			"DispatchRegionInfo",
			"EnvironmentSettings",
			"EstateAccess",
			"EstateChangeInfo",
			"EventQueueGet",
			"ExperiencePreferences",
			"ExperienceQuery",
			"ExtEnvironment",
			"FetchInventory2",
			"FetchInventoryDescendents2",
			"FetchLib2",
			"FetchLibDescendents2",
			"FindExperienceByName",
			"GetAdminExperiences",
			"GetCreatorExperiences",
			"GetDisplayNames",
			"GetExperienceInfo",
			"GetExperiences",
			"GetMetadata",
			"GetObjectCost",
			"GetObjectPhysicsData",
			"GroupAPIv1",
			"GroupExperiences",
			"GroupMemberData",
			"GroupProposalBallot",
			"HomeLocation",
			"IncrementCOFVersion",
			"InterestList",
			"InventoryAPIv3",
			"IsExperienceAdmin",
			"IsExperienceContributor",
			"LandResources",
			"LibraryAPIv3",
			"LSLSyntax",
			"MapLayer",
			"MapLayerGod",
			"MeshUploadFlag",
			"NavMeshGenerationStatus",
			"NewFileAgentInventory",
			"ObjectAnimation",
			"ObjectMedia",
			"ObjectMediaNavigate",
			"ObjectNavMeshProperties",
			"ParcelPropertiesUpdate",
			"ParcelVoiceInfoRequest",
			"ProductInfoRequest",
			"ProvisionVoiceAccountRequest",
			"ReadOfflineMsgs",
			"RegionExperiences",
			"RegionObjects",
			"RemoteParcelRequest",
			"RenderMaterials",
			"RequestTextureDownload",
			"ResourceCostSelected",
			"RetrieveNavMeshSrc",
			"SearchStatRequest",
			"SearchStatTracking",
			"SendPostcard",
			"SendUserReport",
			"SendUserReportWithScreenshot",
			"ServerReleaseNotes",
			"SetDisplayName",
			"SimConsoleAsync",
			"SimulatorFeatures",
			"StartGroupProposal",
			"TerrainNavMeshProperties",
			"TextureStats",
			"UntrustedSimulatorMessage",
			"UpdateAgentInformation",
			"UpdateAgentLanguage",
			"UpdateAvatarAppearance",
			"UpdateExperience",
			"UpdateGestureAgentInventory",
			"UpdateGestureTaskInventory",
			"UpdateNotecardAgentInventory",
			"UpdateNotecardTaskInventory",
			"UpdateScriptAgent",
			"UpdateScriptTask",
			"UpdateSettingsAgentInventory",
			"UpdateSettingsTaskInventory",
			"UploadAgentProfileImage",
			"UploadBakedTexture",
			"UserInfo",
			"ViewerAsset",
			"ViewerBenefits",
			"ViewerMetrics",
			"ViewerStartAuction",
			"ViewerStats",
		]

		const response = await this.request("POST", capabilities)

		const data = z
			.record(z.string(), z.string().or(z.object()))
			.parse(LLSD.parseXml(await response.text()))

		for (const [name, url] of Object.entries(data)) {
			if (typeof url === "string") {
				this.capabilities.set(name, url)
			}
		}

		if (this.capabilities.has("EventQueueGet")) {
			const eventQueueUrl = this.capabilities.get("EventQueueGet")!

			this.client.emit("debug", "Starting event queue...")

			this.eventQueue = new EventQueue(
				this.client,
				eventQueueUrl,
				(message) => {
					// console.debug("Event queue message:", message.message, message.body)
					this.handleEventQueueMessage(message)
				},
			)

			this.eventQueue.start()
		}
	}

	public destroy() {
		if (this.eventQueue) {
			this.eventQueue.stop()
			this.eventQueue = undefined
		}
	}

	private request(
		method: "GET" | "POST" | "PUT" | "DELETE",
		body: unknown,
		contentType: string = this.contentType,
	) {
		return fetch(this.seedCapabilityUrl, {
			method,
			body: body instanceof Buffer ? body : LLSD.formatXml(body),
			headers: { "Content-Type": contentType },
		})
	}

	private handleEventQueueMessage({ message, body }: EventQueueMessage) {
		switch (message) {
			case "ParcelProperties":
				try {
					const parcelData = mapEventQueuePacketData<ParcelPropertiesData>(
						parcelPropertiesMetadata,
						message,
						body,
					)

					// TODO: pass this through delegate
					this.client.emit(
						"debug",
						`Mapped ParcelProperties: ${JSON.stringify(parcelData)}`,
					)
				} catch (error) {
					this.client.emit("debug", `Error mapping ParcelProperties: ${error}`)
				}
				break

			default:
				// handle other message types or just log them
				this.client.emit(
					"debug",
					`Unhandled event queue message type: ${message}`,
				)
				break
		}
	}
}

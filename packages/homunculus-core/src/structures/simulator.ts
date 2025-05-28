import type { Client } from "~/client"

export interface SimulatorOptions {
	ip: string
	port: number
	circuit: number
	uri?: string
	channel?: string
}

export class Simulator {
	/**
	 * IP address of this Simulator.
	 */
	public ip: string

	/**
	 * Port of which we are able to send UDP packets through to this Simulator.
	 */
	public port: number

	/**
	 * Circuit code we are currently using for this Simulator.
	 */
	public circuit: number

	/**
	 * Capabilities URI for additional features.
	 * @link http://wiki.secondlife.com/wiki/Capabilities
	 */
	public uri?: string

	/**
	 * Simulator channel and version number details.
	 */
	public channel?: string

	/**
	 * @param client The Client that instantiated this Simulator object.
	 */
	constructor(
		private readonly client: Client,
		data: SimulatorOptions,
	) {
		this.ip = data.ip
		this.port = data.port
		this.circuit = data.circuit
		this.uri = data.uri
	}

	/*
    Capabilities
    --------------------
    AgentPreferences
    AgentState
    AttachmentResources
    AvatarPickerSearch
    AvatarRenderInfo
    CharacterProperties
    ChatSessionRequest
    CopyInventoryFromNotecard
    CreateInventoryCategory
    DispatchRegionInfo
    DirectDelivery
    EnvironmentSettings
    EstateChangeInfo
    EventQueueGet
    FacebookConnect
    FlickrConnect
    TwitterConnect
    FetchLib2
    FetchLibDescendents2
    FetchInventory2
    FetchInventoryDescendents2
    IncrementCOFVersion
    GetDisplayNames
    GetExperiences
    AgentExperiences
    FindExperienceByName
    GetExperienceInfo
    GetAdminExperiences
    GetCreatorExperiences
    ExperiencePreferences
    GroupExperiences
    UpdateExperience
    IsExperienceAdmin
    IsExperienceContributor
    RegionExperiences
    GetMesh
    GetMesh2
    GetMetadata
    GetObjectCost
    GetObjectPhysicsData
    GetTexture
    GroupAPIv1
    GroupMemberData
    GroupProposalBallot
    HomeLocation
    LandResources
    LSLSyntax
    MapLayer
    MapLayerGod
    MeshUploadFlag
    NavMeshGenerationStatus
    NewFileAgentInventory
    ObjectMedia
    ObjectMediaNavigate
    ObjectNavMeshProperties
    ParcelPropertiesUpdate
    ParcelVoiceInfoRequest
    ProductInfoRequest
    ProvisionVoiceAccountRequest
    RemoteParcelRequest
    RenderMaterials
    RequestTextureDownload
    ResourceCostSelected
    RetrieveNavMeshSrc
    SearchStatRequest
    SearchStatTracking
    SendPostcard
    SendUserReport
    SendUserReportWithScreenshot
    ServerReleaseNotes
    SetDisplayName
    SimConsoleAsync
    SimulatorFeatures
    StartGroupProposal
    TerrainNavMeshProperties
    TextureStats
    UntrustedSimulatorMessage
    UpdateAgentInformation
    UpdateAgentLanguage
    UpdateAvatarAppearance
    UpdateGestureAgentInventory
    UpdateGestureTaskInventory
    UpdateNotecardAgentInventory
    UpdateNotecardTaskInventory
    UpdateScriptAgent
    UpdateScriptTask
    UploadBakedTexture
    ViewerMetrics
    ViewerStartAuction
    ViewerStats
  */
}

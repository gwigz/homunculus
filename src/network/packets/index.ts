import AbortXfer from "./abort-xfer"
import AcceptCallingCard from "./accept-calling-card"
import AcceptFriendship from "./accept-friendship"
import ActivateGestures from "./activate-gestures"
import ActivateGroup from "./activate-group"
import AddCircuitCode from "./add-circuit-code"
import AgentAlertMessage from "./agent-alert-message"
import AgentAnimation from "./agent-animation"
import AgentCachedTexture from "./agent-cached-texture"
import AgentCachedTextureResponse from "./agent-cached-texture-response"
import AgentDataUpdate from "./agent-data-update"
import AgentDataUpdateRequest from "./agent-data-update-request"
import AgentFOV from "./agent-fov"
import AgentHeightWidth from "./agent-height-width"
import AgentIsNowWearing from "./agent-is-now-wearing"
import AgentMovementComplete from "./agent-movement-complete"
import AgentPause from "./agent-pause"
import AgentQuitCopy from "./agent-quit-copy"
import AgentRequestSit from "./agent-request-sit"
import AgentResume from "./agent-resume"
import AgentSetAppearance from "./agent-set-appearance"
import AgentSit from "./agent-sit"
import AgentThrottle from "./agent-throttle"
import AgentUpdate from "./agent-update"
import AgentWearablesRequest from "./agent-wearables-request"
import AgentWearablesUpdate from "./agent-wearables-update"
import AlertMessage from "./alert-message"
import AssetUploadComplete from "./asset-upload-complete"
import AssetUploadRequest from "./asset-upload-request"
import AtomicPassObject from "./atomic-pass-object"
import AttachedSound from "./attached-sound"
import AttachedSoundGainChange from "./attached-sound-gain-change"
import AvatarAnimation from "./avatar-animation"
import AvatarAppearance from "./avatar-appearance"
import AvatarClassifiedReply from "./avatar-classified-reply"
import AvatarGroupsReply from "./avatar-groups-reply"
import AvatarInterestsReply from "./avatar-interests-reply"
import AvatarInterestsUpdate from "./avatar-interests-update"
import AvatarNotesReply from "./avatar-notes-reply"
import AvatarNotesUpdate from "./avatar-notes-update"
import AvatarPickerReply from "./avatar-picker-reply"
import AvatarPickerRequest from "./avatar-picker-request"
import AvatarPickerRequestBackend from "./avatar-picker-request-backend"
import AvatarPicksReply from "./avatar-picks-reply"
import AvatarPropertiesReply from "./avatar-properties-reply"
import AvatarPropertiesRequest from "./avatar-properties-request"
import AvatarPropertiesRequestBackend from "./avatar-properties-request-backend"
import AvatarPropertiesUpdate from "./avatar-properties-update"
import AvatarSitResponse from "./avatar-sit-response"
import AvatarTextureUpdate from "./avatar-texture-update"
import BulkUpdateInventory from "./bulk-update-inventory"
import BuyObjectInventory from "./buy-object-inventory"
import CameraConstraint from "./camera-constraint"
import CancelAuction from "./cancel-auction"
import ChangeInventoryItemFlags from "./change-inventory-item-flags"
import ChangeUserRights from "./change-user-rights"
import ChatFromSimulator from "./chat-from-simulator"
import ChatFromViewer from "./chat-from-viewer"
import ChatPass from "./chat-pass"
import CheckParcelAuctions from "./check-parcel-auctions"
import CheckParcelSales from "./check-parcel-sales"
import ChildAgentAlive from "./child-agent-alive"
import ChildAgentDying from "./child-agent-dying"
import ChildAgentPositionUpdate from "./child-agent-position-update"
import ChildAgentUnknown from "./child-agent-unknown"
import ChildAgentUpdate from "./child-agent-update"
import ClassifiedDelete from "./classified-delete"
import ClassifiedGodDelete from "./classified-god-delete"
import ClassifiedInfoReply from "./classified-info-reply"
import ClassifiedInfoRequest from "./classified-info-request"
import ClassifiedInfoUpdate from "./classified-info-update"
import ClearFollowCamProperties from "./clear-follow-cam-properties"
import CloseCircuit from "./close-circuit"
import CoarseLocationUpdate from "./coarse-location-update"
import CompleteAgentMovement from "./complete-agent-movement"
import CompleteAuction from "./complete-auction"
import CompletePingCheck from "./complete-ping-check"
import ConfirmAuctionStart from "./confirm-auction-start"
import ConfirmEnableSimulator from "./confirm-enable-simulator"
import ConfirmXferPacket from "./confirm-xfer-packet"
import CopyInventoryItem from "./copy-inventory-item"
import CreateGroupReply from "./create-group-reply"
import CreateGroupRequest from "./create-group-request"
import CreateInventoryFolder from "./create-inventory-folder"
import CreateInventoryItem from "./create-inventory-item"
import CreateLandmarkForEvent from "./create-landmark-for-event"
import CreateNewOutfitAttachments from "./create-new-outfit-attachments"
import CreateTrustedCircuit from "./create-trusted-circuit"
import CrossedRegion from "./crossed-region"
import DataHomeLocationReply from "./data-home-location-reply"
import DataHomeLocationRequest from "./data-home-location-request"
import DataServerLogout from "./data-server-logout"
import DeRezAck from "./de-rez-ack"
import DeRezObject from "./de-rez-object"
import DeactivateGestures from "./deactivate-gestures"
import DeclineCallingCard from "./decline-calling-card"
import DeclineFriendship from "./decline-friendship"
import DenyTrustedCircuit from "./deny-trusted-circuit"
import DerezContainer from "./derez-container"
import DetachAttachmentIntoInv from "./detach-attachment-into-inv"
import DirClassifiedQuery from "./dir-classified-query"
import DirClassifiedQueryBackend from "./dir-classified-query-backend"
import DirClassifiedReply from "./dir-classified-reply"
import DirEventsReply from "./dir-events-reply"
import DirFindQuery from "./dir-find-query"
import DirFindQueryBackend from "./dir-find-query-backend"
import DirGroupsReply from "./dir-groups-reply"
import DirLandQuery from "./dir-land-query"
import DirLandQueryBackend from "./dir-land-query-backend"
import DirPeopleReply from "./dir-people-reply"
import DirPlacesQuery from "./dir-places-query"
import DirPlacesQueryBackend from "./dir-places-query-backend"
import DirPlacesReply from "./dir-places-reply"
import DisableSimulator from "./disable-simulator"
import EconomyData from "./economy-data"
import EconomyDataRequest from "./economy-data-request"
import EdgeDataPacket from "./edge-data-packet"
import EjectGroupMemberReply from "./eject-group-member-reply"
import EjectGroupMemberRequest from "./eject-group-member-request"
import EjectUser from "./eject-user"
import EmailMessageReply from "./email-message-reply"
import EmailMessageRequest from "./email-message-request"
import EnableSimulator from "./enable-simulator"
import EstateCovenantReply from "./estate-covenant-reply"
import EstateCovenantRequest from "./estate-covenant-request"
import EstateOwnerMessage from "./estate-owner-message"
import EventGodDelete from "./event-god-delete"
import EventInfoReply from "./event-info-reply"
import EventInfoRequest from "./event-info-request"
import EventLocationReply from "./event-location-reply"
import EventLocationRequest from "./event-location-request"
import EventNotificationAddRequest from "./event-notification-add-request"
import EventNotificationRemoveRequest from "./event-notification-remove-request"
import FeatureDisabled from "./feature-disabled"
import FetchInventory from "./fetch-inventory"
import FetchInventoryDescendents from "./fetch-inventory-descendents"
import FetchInventoryReply from "./fetch-inventory-reply"
import FindAgent from "./find-agent"
import ForceObjectSelect from "./force-object-select"
import ForceScriptControlRelease from "./force-script-control-release"
import FormFriendship from "./form-friendship"
import FreezeUser from "./freeze-user"
import GenericError from "./generic-error"
import GenericMessage from "./generic-message"
import GetScriptRunning from "./get-script-running"
import GodKickUser from "./god-kick-user"
import GodUpdateRegionInfo from "./god-update-region-info"
import GodlikeMessage from "./godlike-message"
import GrantGodlikePowers from "./grant-godlike-powers"
import GrantUserRights from "./grant-user-rights"
import GroupAccountDetailsReply from "./group-account-details-reply"
import GroupAccountDetailsRequest from "./group-account-details-request"
import GroupAccountSummaryReply from "./group-account-summary-reply"
import GroupAccountSummaryRequest from "./group-account-summary-request"
import GroupAccountTransactionsReply from "./group-account-transactions-reply"
import GroupAccountTransactionsRequest from "./group-account-transactions-request"
import GroupActiveProposalItemReply from "./group-active-proposal-item-reply"
import GroupActiveProposalsRequest from "./group-active-proposals-request"
import GroupDataUpdate from "./group-data-update"
import GroupMembersReply from "./group-members-reply"
import GroupMembersRequest from "./group-members-request"
import GroupNoticeAdd from "./group-notice-add"
import GroupNoticeRequest from "./group-notice-request"
import GroupNoticesListReply from "./group-notices-list-reply"
import GroupNoticesListRequest from "./group-notices-list-request"
import GroupProfileReply from "./group-profile-reply"
import GroupProfileRequest from "./group-profile-request"
import GroupRoleChanges from "./group-role-changes"
import GroupRoleDataReply from "./group-role-data-reply"
import GroupRoleDataRequest from "./group-role-data-request"
import GroupRoleMembersReply from "./group-role-members-reply"
import GroupRoleMembersRequest from "./group-role-members-request"
import GroupRoleUpdate from "./group-role-update"
import GroupTitleUpdate from "./group-title-update"
import GroupTitlesReply from "./group-titles-reply"
import GroupTitlesRequest from "./group-titles-request"
import GroupVoteHistoryItemReply from "./group-vote-history-item-reply"
import GroupVoteHistoryRequest from "./group-vote-history-request"
import HealthMessage from "./health-message"
import ImageData from "./image-data"
import ImageNotInDatabase from "./image-not-in-database"
import ImagePacket from "./image-packet"
import ImprovedInstantMessage from "./improved-instant-message"
import ImprovedTerseObjectUpdate from "./improved-terse-object-update"
import InitiateDownload from "./initiate-download"
import InternalScriptMail from "./internal-script-mail"
import InventoryAssetResponse from "./inventory-asset-response"
import InventoryDescendents from "./inventory-descendents"
import InviteGroupRequest from "./invite-group-request"
import InviteGroupResponse from "./invite-group-response"
import JoinGroupReply from "./join-group-reply"
import JoinGroupRequest from "./join-group-request"
import KickUser from "./kick-user"
import KickUserAck from "./kick-user-ack"
import KillChildAgents from "./kill-child-agents"
import KillObject from "./kill-object"
import LandStatRequest from "./land-stat-request"
import LayerData from "./layer-data"
import LeaveGroupReply from "./leave-group-reply"
import LeaveGroupRequest from "./leave-group-request"
import LinkInventoryItem from "./link-inventory-item"
import LiveHelpGroupReply from "./live-help-group-reply"
import LiveHelpGroupRequest from "./live-help-group-request"
import LoadURL from "./load-url"
import LogDwellTime from "./log-dwell-time"
import LogFailedMoneyTransaction from "./log-failed-money-transaction"
import LogParcelChanges from "./log-parcel-changes"
import LogTextMessage from "./log-text-message"
import LogoutReply from "./logout-reply"
import LogoutRequest from "./logout-request"
import MapBlockReply from "./map-block-reply"
import MapBlockRequest from "./map-block-request"
import MapItemReply from "./map-item-reply"
import MapItemRequest from "./map-item-request"
import MapLayerReply from "./map-layer-reply"
import MapLayerRequest from "./map-layer-request"
import MapNameRequest from "./map-name-request"
import MeanCollisionAlert from "./mean-collision-alert"
import MergeParcel from "./merge-parcel"
import ModifyLand from "./modify-land"
import MoneyBalanceReply from "./money-balance-reply"
import MoneyBalanceRequest from "./money-balance-request"
import MoneyTransferBackend from "./money-transfer-backend"
import MoneyTransferRequest from "./money-transfer-request"
import MoveInventoryFolder from "./move-inventory-folder"
import MoveInventoryItem from "./move-inventory-item"
import MoveTaskInventory from "./move-task-inventory"
import MultipleObjectUpdate from "./multiple-object-update"
import MuteListRequest from "./mute-list-request"
import MuteListUpdate from "./mute-list-update"
import NameValuePair from "./name-value-pair"
import NearestLandingRegionReply from "./nearest-landing-region-reply"
import NearestLandingRegionRequest from "./nearest-landing-region-request"
import NearestLandingRegionUpdated from "./nearest-landing-region-updated"
import NeighborList from "./neighbor-list"
import NetTest from "./net-test"
import ObjectAdd from "./object-add"
import ObjectAttach from "./object-attach"
import ObjectBuy from "./object-buy"
import ObjectCategory from "./object-category"
import ObjectClickAction from "./object-click-action"
import ObjectDeGrab from "./object-de-grab"
import ObjectDelete from "./object-delete"
import ObjectDelink from "./object-delink"
import ObjectDescription from "./object-description"
import ObjectDeselect from "./object-deselect"
import ObjectDetach from "./object-detach"
import ObjectDrop from "./object-drop"
import ObjectDuplicate from "./object-duplicate"
import ObjectDuplicateOnRay from "./object-duplicate-on-ray"
import ObjectExportSelected from "./object-export-selected"
import ObjectExtraParams from "./object-extra-params"
import ObjectFlagUpdate from "./object-flag-update"
import ObjectGrab from "./object-grab"
import ObjectGrabUpdate from "./object-grab-update"
import ObjectGroup from "./object-group"
import ObjectImage from "./object-image"
import ObjectIncludeInSearch from "./object-include-in-search"
import ObjectLink from "./object-link"
import ObjectMaterial from "./object-material"
import ObjectName from "./object-name"
import ObjectOwner from "./object-owner"
import ObjectPermissions from "./object-permissions"
import ObjectProperties from "./object-properties"
import ObjectPropertiesFamily from "./object-properties-family"
import ObjectRotation from "./object-rotation"
import ObjectSaleInfo from "./object-sale-info"
import ObjectSelect from "./object-select"
import ObjectShape from "./object-shape"
import ObjectSpinStart from "./object-spin-start"
import ObjectSpinStop from "./object-spin-stop"
import ObjectSpinUpdate from "./object-spin-update"
import ObjectUpdate from "./object-update"
import ObjectUpdateCached from "./object-update-cached"
import ObjectUpdateCompressed from "./object-update-compressed"
import OfferCallingCard from "./offer-calling-card"
import OfflineNotification from "./offline-notification"
import OnlineNotification from "./online-notification"
import OpenCircuit from "./open-circuit"
import Packet from "./packet"
import PacketAck from "./packet-ack"
import ParcelAccessListReply from "./parcel-access-list-reply"
import ParcelAccessListRequest from "./parcel-access-list-request"
import ParcelAccessListUpdate from "./parcel-access-list-update"
import ParcelAuctions from "./parcel-auctions"
import ParcelBuy from "./parcel-buy"
import ParcelBuyPass from "./parcel-buy-pass"
import ParcelClaim from "./parcel-claim"
import ParcelDeedToGroup from "./parcel-deed-to-group"
import ParcelDisableObjects from "./parcel-disable-objects"
import ParcelDivide from "./parcel-divide"
import ParcelDwellReply from "./parcel-dwell-reply"
import ParcelDwellRequest from "./parcel-dwell-request"
import ParcelGodForceOwner from "./parcel-god-force-owner"
import ParcelGodMarkAsContent from "./parcel-god-mark-as-content"
import ParcelInfoReply from "./parcel-info-reply"
import ParcelInfoRequest from "./parcel-info-request"
import ParcelJoin from "./parcel-join"
import ParcelMediaCommandMessage from "./parcel-media-command-message"
import ParcelMediaUpdate from "./parcel-media-update"
import ParcelObjectOwnersRequest from "./parcel-object-owners-request"
import ParcelOverlay from "./parcel-overlay"
import ParcelProperties from "./parcel-properties"
import ParcelPropertiesRequest from "./parcel-properties-request"
import ParcelPropertiesRequestByID from "./parcel-properties-request-by-id"
import ParcelPropertiesUpdate from "./parcel-properties-update"
import ParcelReclaim from "./parcel-reclaim"
import ParcelRelease from "./parcel-release"
import ParcelRename from "./parcel-rename"
import ParcelReturnObjects from "./parcel-return-objects"
import ParcelSales from "./parcel-sales"
import ParcelSelectObjects from "./parcel-select-objects"
import ParcelSetOtherCleanTime from "./parcel-set-other-clean-time"
import PayPriceReply from "./pay-price-reply"
import PickDelete from "./pick-delete"
import PickGodDelete from "./pick-god-delete"
import PickInfoReply from "./pick-info-reply"
import PickInfoUpdate from "./pick-info-update"
import PlacesQuery from "./places-query"
import PreloadSound from "./preload-sound"
import PurgeInventoryDescendents from "./purge-inventory-descendents"
import RebakeAvatarTextures from "./rebake-avatar-textures"
import Redo from "./redo"
import RegionHandleRequest from "./region-handle-request"
import RegionHandshake from "./region-handshake"
import RegionHandshakeReply from "./region-handshake-reply"
import RegionIDAndHandleReply from "./region-id-and-handle-reply"
import RegionInfo from "./region-info"
import RegionPresenceRequestByHandle from "./region-presence-request-by-handle"
import RegionPresenceRequestByRegionID from "./region-presence-request-by-region-id"
import RegionPresenceResponse from "./region-presence-response"
import RemoveAttachment from "./remove-attachment"
import RemoveInventoryFolder from "./remove-inventory-folder"
import RemoveInventoryItem from "./remove-inventory-item"
import RemoveInventoryObjects from "./remove-inventory-objects"
import RemoveMuteListEntry from "./remove-mute-list-entry"
import RemoveNameValuePair from "./remove-name-value-pair"
import RemoveParcel from "./remove-parcel"
import RemoveTaskInventory from "./remove-task-inventory"
import ReplyTaskInventory from "./reply-task-inventory"
import ReportAutosaveCrash from "./report-autosave-crash"
import RequestGodlikePowers from "./request-godlike-powers"
import RequestImage from "./request-image"
import RequestInventoryAsset from "./request-inventory-asset"
import RequestMultipleObjects from "./request-multiple-objects"
import RequestObjectPropertiesFamily from "./request-object-properties-family"
import RequestParcelTransfer from "./request-parcel-transfer"
import RequestPayPrice from "./request-pay-price"
import RequestRegionInfo from "./request-region-info"
import RequestTaskInventory from "./request-task-inventory"
import RequestTrustedCircuit from "./request-trusted-circuit"
import RequestXfer from "./request-xfer"
import RetrieveInstantMessages from "./retrieve-instant-messages"
import RevokePermissions from "./revoke-permissions"
import RezMultipleAttachmentsFromInv from "./rez-multiple-attachments-from-inv"
import RezObject from "./rez-object"
import RezObjectFromNotecard from "./rez-object-from-notecard"
import RezScript from "./rez-script"
import RezSingleAttachmentFromInv from "./rez-single-attachment-from-inv"
import RoutedMoneyBalanceReply from "./routed-money-balance-reply"
import RpcChannelReply from "./rpc-channel-reply"
import RpcChannelRequest from "./rpc-channel-request"
import RpcScriptReplyInbound from "./rpc-script-reply-inbound"
import RpcScriptRequestInbound from "./rpc-script-request-inbound"
import SaveAssetIntoInventory from "./save-asset-into-inventory"
import ScriptAnswerYes from "./script-answer-yes"
import ScriptControlChange from "./script-control-change"
import ScriptDataReply from "./script-data-reply"
import ScriptDataRequest from "./script-data-request"
import ScriptDialog from "./script-dialog"
import ScriptDialogReply from "./script-dialog-reply"
import ScriptMailRegistration from "./script-mail-registration"
import ScriptQuestion from "./script-question"
import ScriptReset from "./script-reset"
import ScriptSensorReply from "./script-sensor-reply"
import ScriptSensorRequest from "./script-sensor-request"
import ScriptTeleportRequest from "./script-teleport-request"
import SendPostcard from "./send-postcard"
import SendXferPacket from "./send-xfer-packet"
import SetAlwaysRun from "./set-always-run"
import SetCPURatio from "./set-cpu-ratio"
import SetFollowCamProperties from "./set-follow-cam-properties"
import SetGroupAcceptNotices from "./set-group-accept-notices"
import SetGroupContribution from "./set-group-contribution"
import SetScriptRunning from "./set-script-running"
import SetSimPresenceInDatabase from "./set-sim-presence-in-database"
import SetSimStatusInDatabase from "./set-sim-status-in-database"
import SetStartLocation from "./set-start-location"
import SetStartLocationRequest from "./set-start-location-request"
import SimCrashed from "./sim-crashed"
import SimStats from "./sim-stats"
import SimStatus from "./sim-status"
import SimWideDeletes from "./sim-wide-deletes"
import SimulatorLoad from "./simulator-load"
import SimulatorMapUpdate from "./simulator-map-update"
import SimulatorPresentAtLocation from "./simulator-present-at-location"
import SimulatorReady from "./simulator-ready"
import SimulatorSetMap from "./simulator-set-map"
import SimulatorShutdownRequest from "./simulator-shutdown-request"
import SimulatorViewerTimeMessage from "./simulator-viewer-time-message"
import SoundTrigger from "./sound-trigger"
import StartAuction from "./start-auction"
import StartLure from "./start-lure"
import StartPingCheck from "./start-ping-check"
import StateSave from "./state-save"
import SubscribeLoad from "./subscribe-load"
import SystemKickUser from "./system-kick-user"
import SystemMessage from "./system-message"
import TallyVotes from "./tally-votes"
import TelehubInfo from "./telehub-info"
import TeleportCancel from "./teleport-cancel"
import TeleportFailed from "./teleport-failed"
import TeleportFinish from "./teleport-finish"
import TeleportLandingStatusChanged from "./teleport-landing-status-changed"
import TeleportLandmarkRequest from "./teleport-landmark-request"
import TeleportLocal from "./teleport-local"
import TeleportLocationRequest from "./teleport-location-request"
import TeleportLureRequest from "./teleport-lure-request"
import TeleportProgress from "./teleport-progress"
import TeleportRequest from "./teleport-request"
import TeleportStart from "./teleport-start"
import TerminateFriendship from "./terminate-friendship"
import TestMessage from "./test-message"
import TrackAgent from "./track-agent"
import TransferAbort from "./transfer-abort"
import TransferInfo from "./transfer-info"
import TransferInventory from "./transfer-inventory"
import TransferInventoryAck from "./transfer-inventory-ack"
import TransferPacket from "./transfer-packet"
import TransferRequest from "./transfer-request"
import Undo from "./undo"
import UndoLand from "./undo-land"
import UnsubscribeLoad from "./unsubscribe-load"
import UpdateAttachment from "./update-attachment"
import UpdateCreateInventoryItem from "./update-create-inventory-item"
import UpdateGroupInfo from "./update-group-info"
import UpdateInventoryFolder from "./update-inventory-folder"
import UpdateInventoryItem from "./update-inventory-item"
import UpdateMuteListEntry from "./update-mute-list-entry"
import UpdateParcel from "./update-parcel"
import UpdateSimulator from "./update-simulator"
import UpdateTaskInventory from "./update-task-inventory"
import UpdateUserInfo from "./update-user-info"
import UseCachedMuteList from "./use-cached-mute-list"
import UseCircuitCode from "./use-circuit-code"
import UserInfoReply from "./user-info-reply"
import UserInfoRequest from "./user-info-request"
import UserReport from "./user-report"
import UserReportInternal from "./user-report-internal"
import UUIDGroupNameReply from "./uuid-group-name-reply"
import UUIDGroupNameRequest from "./uuid-group-name-request"
import UUIDNameReply from "./uuid-name-reply"
import UUIDNameRequest from "./uuid-name-request"
import VelocityInterpolateOff from "./velocity-interpolate-off"
import VelocityInterpolateOn from "./velocity-interpolate-on"
import ViewerEffect from "./viewer-effect"
import ViewerFrozenMessage from "./viewer-frozen-message"
import ViewerStartAuction from "./viewer-start-auction"

export {
	AbortXfer,
	AcceptCallingCard,
	AcceptFriendship,
	ActivateGestures,
	ActivateGroup,
	AddCircuitCode,
	AgentAlertMessage,
	AgentAnimation,
	AgentCachedTexture,
	AgentCachedTextureResponse,
	AgentDataUpdate,
	AgentDataUpdateRequest,
	AgentFOV,
	AgentHeightWidth,
	AgentIsNowWearing,
	AgentMovementComplete,
	AgentPause,
	AgentQuitCopy,
	AgentRequestSit,
	AgentResume,
	AgentSetAppearance,
	AgentSit,
	AgentThrottle,
	AgentUpdate,
	AgentWearablesRequest,
	AgentWearablesUpdate,
	AlertMessage,
	AssetUploadComplete,
	AssetUploadRequest,
	AtomicPassObject,
	AttachedSound,
	AttachedSoundGainChange,
	AvatarAnimation,
	AvatarAppearance,
	AvatarClassifiedReply,
	AvatarGroupsReply,
	AvatarInterestsReply,
	AvatarInterestsUpdate,
	AvatarNotesReply,
	AvatarNotesUpdate,
	AvatarPickerReply,
	AvatarPickerRequest,
	AvatarPickerRequestBackend,
	AvatarPicksReply,
	AvatarPropertiesReply,
	AvatarPropertiesRequest,
	AvatarPropertiesRequestBackend,
	AvatarPropertiesUpdate,
	AvatarSitResponse,
	AvatarTextureUpdate,
	BulkUpdateInventory,
	BuyObjectInventory,
	CameraConstraint,
	CancelAuction,
	ChangeInventoryItemFlags,
	ChangeUserRights,
	ChatFromSimulator,
	ChatFromViewer,
	ChatPass,
	CheckParcelAuctions,
	CheckParcelSales,
	ChildAgentAlive,
	ChildAgentDying,
	ChildAgentPositionUpdate,
	ChildAgentUnknown,
	ChildAgentUpdate,
	ClassifiedDelete,
	ClassifiedGodDelete,
	ClassifiedInfoReply,
	ClassifiedInfoRequest,
	ClassifiedInfoUpdate,
	ClearFollowCamProperties,
	CloseCircuit,
	CoarseLocationUpdate,
	CompleteAgentMovement,
	CompleteAuction,
	CompletePingCheck,
	ConfirmAuctionStart,
	ConfirmEnableSimulator,
	ConfirmXferPacket,
	CopyInventoryItem,
	CreateGroupReply,
	CreateGroupRequest,
	CreateInventoryFolder,
	CreateInventoryItem,
	CreateLandmarkForEvent,
	CreateNewOutfitAttachments,
	CreateTrustedCircuit,
	CrossedRegion,
	DataHomeLocationReply,
	DataHomeLocationRequest,
	DataServerLogout,
	DeactivateGestures,
	DeclineCallingCard,
	DeclineFriendship,
	DenyTrustedCircuit,
	DeRezAck,
	DerezContainer,
	DeRezObject,
	DetachAttachmentIntoInv,
	DirClassifiedQuery,
	DirClassifiedQueryBackend,
	DirClassifiedReply,
	DirEventsReply,
	DirFindQuery,
	DirFindQueryBackend,
	DirGroupsReply,
	DirLandQuery,
	DirLandQueryBackend,
	DirPeopleReply,
	DirPlacesQuery,
	DirPlacesQueryBackend,
	DirPlacesReply,
	DisableSimulator,
	EconomyData,
	EconomyDataRequest,
	EdgeDataPacket,
	EjectGroupMemberReply,
	EjectGroupMemberRequest,
	EjectUser,
	EmailMessageReply,
	EmailMessageRequest,
	EnableSimulator,
	EstateCovenantReply,
	EstateCovenantRequest,
	EstateOwnerMessage,
	EventGodDelete,
	EventInfoReply,
	EventInfoRequest,
	EventLocationReply,
	EventLocationRequest,
	EventNotificationAddRequest,
	EventNotificationRemoveRequest,
	FeatureDisabled,
	FetchInventory,
	FetchInventoryDescendents,
	FetchInventoryReply,
	FindAgent,
	ForceObjectSelect,
	ForceScriptControlRelease,
	FormFriendship,
	FreezeUser,
	GenericError,
	GenericMessage,
	GetScriptRunning,
	GodKickUser,
	GodlikeMessage,
	GodUpdateRegionInfo,
	GrantGodlikePowers,
	GrantUserRights,
	GroupAccountDetailsReply,
	GroupAccountDetailsRequest,
	GroupAccountSummaryReply,
	GroupAccountSummaryRequest,
	GroupAccountTransactionsReply,
	GroupAccountTransactionsRequest,
	GroupActiveProposalItemReply,
	GroupActiveProposalsRequest,
	GroupDataUpdate,
	GroupMembersReply,
	GroupMembersRequest,
	GroupNoticeAdd,
	GroupNoticeRequest,
	GroupNoticesListReply,
	GroupNoticesListRequest,
	GroupProfileReply,
	GroupProfileRequest,
	GroupRoleChanges,
	GroupRoleDataReply,
	GroupRoleDataRequest,
	GroupRoleMembersReply,
	GroupRoleMembersRequest,
	GroupRoleUpdate,
	GroupTitlesReply,
	GroupTitlesRequest,
	GroupTitleUpdate,
	GroupVoteHistoryItemReply,
	GroupVoteHistoryRequest,
	HealthMessage,
	ImageData,
	ImageNotInDatabase,
	ImagePacket,
	ImprovedInstantMessage,
	ImprovedTerseObjectUpdate,
	InitiateDownload,
	InternalScriptMail,
	InventoryAssetResponse,
	InventoryDescendents,
	InviteGroupRequest,
	InviteGroupResponse,
	JoinGroupReply,
	JoinGroupRequest,
	KickUser,
	KickUserAck,
	KillChildAgents,
	KillObject,
	LandStatRequest,
	LayerData,
	LeaveGroupReply,
	LeaveGroupRequest,
	LinkInventoryItem,
	LiveHelpGroupReply,
	LiveHelpGroupRequest,
	LoadURL,
	LogDwellTime,
	LogFailedMoneyTransaction,
	LogoutReply,
	LogoutRequest,
	LogParcelChanges,
	LogTextMessage,
	MapBlockReply,
	MapBlockRequest,
	MapItemReply,
	MapItemRequest,
	MapLayerReply,
	MapLayerRequest,
	MapNameRequest,
	MeanCollisionAlert,
	MergeParcel,
	ModifyLand,
	MoneyBalanceReply,
	MoneyBalanceRequest,
	MoneyTransferBackend,
	MoneyTransferRequest,
	MoveInventoryFolder,
	MoveInventoryItem,
	MoveTaskInventory,
	MultipleObjectUpdate,
	MuteListRequest,
	MuteListUpdate,
	NameValuePair,
	NearestLandingRegionReply,
	NearestLandingRegionRequest,
	NearestLandingRegionUpdated,
	NeighborList,
	NetTest,
	ObjectAdd,
	ObjectAttach,
	ObjectBuy,
	ObjectCategory,
	ObjectClickAction,
	ObjectDeGrab,
	ObjectDelete,
	ObjectDelink,
	ObjectDescription,
	ObjectDeselect,
	ObjectDetach,
	ObjectDrop,
	ObjectDuplicate,
	ObjectDuplicateOnRay,
	ObjectExportSelected,
	ObjectExtraParams,
	ObjectFlagUpdate,
	ObjectGrab,
	ObjectGrabUpdate,
	ObjectGroup,
	ObjectImage,
	ObjectIncludeInSearch,
	ObjectLink,
	ObjectMaterial,
	ObjectName,
	ObjectOwner,
	ObjectPermissions,
	ObjectProperties,
	ObjectPropertiesFamily,
	ObjectRotation,
	ObjectSaleInfo,
	ObjectSelect,
	ObjectShape,
	ObjectSpinStart,
	ObjectSpinStop,
	ObjectSpinUpdate,
	ObjectUpdate,
	ObjectUpdateCached,
	ObjectUpdateCompressed,
	OfferCallingCard,
	OfflineNotification,
	OnlineNotification,
	OpenCircuit,
	Packet,
	PacketAck,
	ParcelAccessListReply,
	ParcelAccessListRequest,
	ParcelAccessListUpdate,
	ParcelAuctions,
	ParcelBuy,
	ParcelBuyPass,
	ParcelClaim,
	ParcelDeedToGroup,
	ParcelDisableObjects,
	ParcelDivide,
	ParcelDwellReply,
	ParcelDwellRequest,
	ParcelGodForceOwner,
	ParcelGodMarkAsContent,
	ParcelInfoReply,
	ParcelInfoRequest,
	ParcelJoin,
	ParcelMediaCommandMessage,
	ParcelMediaUpdate,
	ParcelObjectOwnersRequest,
	ParcelOverlay,
	ParcelProperties,
	ParcelPropertiesRequest,
	ParcelPropertiesRequestByID,
	ParcelPropertiesUpdate,
	ParcelReclaim,
	ParcelRelease,
	ParcelRename,
	ParcelReturnObjects,
	ParcelSales,
	ParcelSelectObjects,
	ParcelSetOtherCleanTime,
	PayPriceReply,
	PickDelete,
	PickGodDelete,
	PickInfoReply,
	PickInfoUpdate,
	PlacesQuery,
	PreloadSound,
	PurgeInventoryDescendents,
	RebakeAvatarTextures,
	Redo,
	RegionHandleRequest,
	RegionHandshake,
	RegionHandshakeReply,
	RegionIDAndHandleReply,
	RegionInfo,
	RegionPresenceRequestByHandle,
	RegionPresenceRequestByRegionID,
	RegionPresenceResponse,
	RemoveAttachment,
	RemoveInventoryFolder,
	RemoveInventoryItem,
	RemoveInventoryObjects,
	RemoveMuteListEntry,
	RemoveNameValuePair,
	RemoveParcel,
	RemoveTaskInventory,
	ReplyTaskInventory,
	ReportAutosaveCrash,
	RequestGodlikePowers,
	RequestImage,
	RequestInventoryAsset,
	RequestMultipleObjects,
	RequestObjectPropertiesFamily,
	RequestParcelTransfer,
	RequestPayPrice,
	RequestRegionInfo,
	RequestTaskInventory,
	RequestTrustedCircuit,
	RequestXfer,
	RetrieveInstantMessages,
	RevokePermissions,
	RezMultipleAttachmentsFromInv,
	RezObject,
	RezObjectFromNotecard,
	RezScript,
	RezSingleAttachmentFromInv,
	RoutedMoneyBalanceReply,
	RpcChannelReply,
	RpcChannelRequest,
	RpcScriptReplyInbound,
	RpcScriptRequestInbound,
	SaveAssetIntoInventory,
	ScriptAnswerYes,
	ScriptControlChange,
	ScriptDataReply,
	ScriptDataRequest,
	ScriptDialog,
	ScriptDialogReply,
	ScriptMailRegistration,
	ScriptQuestion,
	ScriptReset,
	ScriptSensorReply,
	ScriptSensorRequest,
	ScriptTeleportRequest,
	SendPostcard,
	SendXferPacket,
	SetAlwaysRun,
	SetCPURatio,
	SetFollowCamProperties,
	SetGroupAcceptNotices,
	SetGroupContribution,
	SetScriptRunning,
	SetSimPresenceInDatabase,
	SetSimStatusInDatabase,
	SetStartLocation,
	SetStartLocationRequest,
	SimCrashed,
	SimStats,
	SimStatus,
	SimulatorLoad,
	SimulatorMapUpdate,
	SimulatorPresentAtLocation,
	SimulatorReady,
	SimulatorSetMap,
	SimulatorShutdownRequest,
	SimulatorViewerTimeMessage,
	SimWideDeletes,
	SoundTrigger,
	StartAuction,
	StartLure,
	StartPingCheck,
	StateSave,
	SubscribeLoad,
	SystemKickUser,
	SystemMessage,
	TallyVotes,
	TelehubInfo,
	TeleportCancel,
	TeleportFailed,
	TeleportFinish,
	TeleportLandingStatusChanged,
	TeleportLandmarkRequest,
	TeleportLocal,
	TeleportLocationRequest,
	TeleportLureRequest,
	TeleportProgress,
	TeleportRequest,
	TeleportStart,
	TerminateFriendship,
	TestMessage,
	TrackAgent,
	TransferAbort,
	TransferInfo,
	TransferInventory,
	TransferInventoryAck,
	TransferPacket,
	TransferRequest,
	Undo,
	UndoLand,
	UnsubscribeLoad,
	UpdateAttachment,
	UpdateCreateInventoryItem,
	UpdateGroupInfo,
	UpdateInventoryFolder,
	UpdateInventoryItem,
	UpdateMuteListEntry,
	UpdateParcel,
	UpdateSimulator,
	UpdateTaskInventory,
	UpdateUserInfo,
	UseCachedMuteList,
	UseCircuitCode,
	UserInfoReply,
	UserInfoRequest,
	UserReport,
	UserReportInternal,
	UUIDGroupNameReply,
	UUIDGroupNameRequest,
	UUIDNameReply,
	UUIDNameRequest,
	VelocityInterpolateOff,
	VelocityInterpolateOn,
	ViewerEffect,
	ViewerFrozenMessage,
	ViewerStartAuction,
}

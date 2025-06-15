import { identity, Schema } from "effect"
import { toCamelCase } from "~/utilities/to-camel-case"

function camelCaseKeysDeep<T = unknown>(object: T): T {
	if (Array.isArray(object)) {
		return object.map(camelCaseKeysDeep) as T
	}

	if (object && typeof object === "object" && object.constructor === Object) {
		return Object.fromEntries(
			Object.entries(object).map(([k, v]) => [
				toCamelCase(k),
				camelCaseKeysDeep(v),
			]),
		) as T
	}

	return object
}

const Vector3 = Schema.transform(
	Schema.String,
	Schema.Tuple(Schema.Number, Schema.Number, Schema.Number),
	{
		strict: true,
		decode: (raw) => {
			const [x, y, z] = raw.match(/-?\d+(?:\.\d+)?/g)! as string[]

			return [Number(x), Number(y), Number(z)] as [number, number, number]
		},
		encode: (vector) => `[r${vector[0]}, r${vector[1]}, r${vector[2]}]`,
	},
)

const RegionHandle = Schema.transform(Schema.String, Schema.BigIntFromSelf, {
	strict: true,
	decode: (raw) => {
		const [high, low] = raw.match(/\d+/g)! as string[]

		return (BigInt(high ?? 0) << 32n) | BigInt(low ?? 0)
	},
	encode: (encoded) => encoded.toString(),
})

const PremiumPackageBenefits = Schema.partial(
	Schema.Struct({
		animatedObjectLimit: Schema.Number,
		animationUploadCost: Schema.Number,
		attachmentLimit: Schema.Number,
		betaGridLand: Schema.Number,
		createGroupCost: Schema.Number,
		createRepeatingEvents: Schema.Number,
		estateAccessToken: Schema.String,
		gridwideExperienceLimit: Schema.Number,
		groupMembershipLimit: Schema.Number,
		landAuctionsAllowed: Schema.Number,
		lastnameChangeAllowed: Schema.Number,
		lastnameChangeCost: Schema.Number,
		lastnameChangeRate: Schema.Number,
		lindenBuyFee: Schema.Number,
		lindenHomes: Schema.Array(Schema.String),
		liveChat: Schema.Number,
		localExperiences: Schema.Number,
		mainlandTier: Schema.Number,
		marketplaceConciergeSupport: Schema.Number,
		marketplaceListingLimit: Schema.Number,
		marketplacePleLimit: Schema.Number,
		meshUploadCost: Schema.Number,
		objectAccountLevel: Schema.Number,
		oneTimeEventAllowed: Schema.Number,
		oneTimeEventCost: Schema.Number,
		partnerFee: Schema.Number,
		phoneSupport: Schema.Number,
		picksLimit: Schema.Number,
		placePages: Schema.partial(
			Schema.Struct({
				additionalListingCost: Schema.Number,
				numFreeListings: Schema.Number,
			}),
		),
		premiumAccess: Schema.Number,
		premiumAlts: Schema.Number,
		premiumGifts: Schema.Number,
		priorityEntry: Schema.Number,
		repeatingEventsCost: Schema.Number,
		scriptLimit: Schema.Number,
		signupBonus: Schema.Number,
		soundUploadCost: Schema.Number,
		stipend: Schema.Number,
		storedImLimit: Schema.Number,
		largeTextureUploadCost: Schema.Array(Schema.Number),
		textureUploadCost: Schema.Number,
		transactionHistoryLimit: Schema.Number,
		unpartnerFee: Schema.Number,
		useAnimesh: Schema.Number,
		voiceMorphing: Schema.Number,
	}),
)

const BaseSuccess = Schema.partial(
	Schema.Struct({
		agentAccess: Schema.String,
		message: Schema.String,
		maxAgentGroups: Schema.Number,
		openidUrl: Schema.String,
		openidToken: Schema.String,
		cofVersion: Schema.Number,
		agentAppearanceService: Schema.String,
		inventoryRoot: Schema.Array(
			Schema.partial(Schema.Struct({ folderId: Schema.String })),
		),
		inventorySkeleton: Schema.Array(
			Schema.partial(
				Schema.Struct({
					name: Schema.String,
					folderId: Schema.String,
					parentId: Schema.String,
					typeDefault: Schema.Number,
					version: Schema.Number,
				}),
			),
		),
		agentAccessMax: Schema.String,
		agentRegionAccess: Schema.String,
		premiumPackages: Schema.Record({
			key: Schema.String,
			value: Schema.partial(
				Schema.Struct({
					benefits: PremiumPackageBenefits,
					description: Schema.partial(
						Schema.Struct({
							name: Schema.Record({ key: Schema.String, value: Schema.String }),
						}),
					),
				}),
			),
		}),
		buddyList: Schema.Array(
			Schema.partial(
				Schema.Struct({
					buddyId: Schema.String,
					buddyRightsHas: Schema.Number,
					buddyRightsGiven: Schema.Number,
				}),
			),
		),
		mapServerUrl: Schema.String,
		loginFlags: Schema.Array(
			Schema.partial(
				Schema.Struct({
					stipendSinceLogin: Schema.String,
					everLoggedIn: Schema.String,
					gendered: Schema.String,
					daylightSavings: Schema.String,
				}),
			),
		),
		udpBlacklist: Schema.String,
		accountLevelBenefits: PremiumPackageBenefits,
		accountType: Schema.String,
		lindenStatusCode: Schema.String,
		agentFlags: Schema.Number,
		maxGodLevel: Schema.Number,
		godLevel: Schema.Number,
		lookAt: Vector3,
		homeInfo: Schema.partial(
			Schema.Struct({
				regionHandle: RegionHandle,
				position: Vector3,
				lookAt: Vector3,
			}),
		),
		home: Schema.String,
		secondsSinceEpoch: Schema.Number,
		secureSessionId: Schema.String,
		seedCapability: Schema.String,
		startLocation: Schema.String,
	}),
)

const LoginSuccess = Schema.extend(
	Schema.Struct({
		login: Schema.Literal(true),
		circuitCode: Schema.Number,
		simIp: Schema.String,
		simPort: Schema.Number,
		regionX: Schema.Number,
		regionY: Schema.Number,
		agentId: Schema.String,
		sessionId: Schema.String,
		firstName: Schema.transform(Schema.String, Schema.String, {
			decode: (value) =>
				/^"[a-z0-9 ]+"$/i.test(value) ? value.replace(/"/g, "") : value,
			encode: identity,
		}),
		lastName: Schema.String,
	}),
	BaseSuccess,
)

const LoginFailure = Schema.Struct({
	login: Schema.Literal(false),
	reason: Schema.optional(Schema.String),
	message: Schema.optional(Schema.String),
})

export const LoginResponse = Schema.transform(
	Schema.Record({ key: Schema.String, value: Schema.Unknown }),
	Schema.Union(LoginFailure, LoginSuccess),
	{
		strict: true,
		decode: (input) => ({
			...camelCaseKeysDeep<any>(input),
			login: input.login === "true",
		}),
		encode: identity,
	},
)

export type LoginResponse = Schema.Schema.Type<typeof LoginResponse>

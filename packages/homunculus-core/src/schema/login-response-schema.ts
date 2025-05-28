import { z } from "zod/v4"
import { Vector3 } from "~/network/types"

function toCamelCase(str: string): string {
	return str.replace(/[_-](\w)/g, (_, c) => (c ? c.toUpperCase() : ""))
}

function camelCaseKeysDeep(object: any): any {
	if (Array.isArray(object)) {
		return object.map(camelCaseKeysDeep)
	}

	if (object && typeof object === "object" && object.constructor === Object) {
		return Object.fromEntries(
			Object.entries(object).map(([k, v]) => [
				toCamelCase(k),
				camelCaseKeysDeep(v),
			]),
		)
	}

	return object
}

const vectorSchema = z
	.string()
	.regex(/^\[r-?\d+(\.\d+)?,\s*r-?\d+(\.\d+)?,\s*r-?\d+(\.\d+)?\]$/)
	.transform((value) => {
		const [x, y, z] = value.match(/\d+(\.\d+)?/g)!

		return new Vector3(Number(x), Number(y), Number(z))
	})

const regionHandleSchema = z
	.string()
	.regex(/^\[r\d+,\s*r\d+\]$/)
	.transform((value) => {
		const [x, y] = value.match(/\d+/g)!

		return ((BigInt(x) << 32n) | BigInt(y!)).toString()
	})

const premiumPackageBenefitsSchema = z
	.object({
		animatedObjectLimit: z.number(),
		animationUploadCost: z.number(),
		attachmentLimit: z.number(),
		betaGridLand: z.number(),
		createGroupCost: z.number(),
		createRepeatingEvents: z.number(),
		estateAccessToken: z.string(),
		gridwideExperienceLimit: z.number(),
		groupMembershipLimit: z.number(),
		landAuctionsAllowed: z.number(),
		lastnameChangeAllowed: z.number(),
		lastnameChangeCost: z.number(),
		lastnameChangeRate: z.number(),
		lindenBuyFee: z.number(),
		lindenHomes: z.array(z.string()),
		liveChat: z.number(),
		localExperiences: z.number(),
		mainlandTier: z.number(),
		marketplaceConciergeSupport: z.number(),
		marketplaceListingLimit: z.number(),
		marketplacePleLimit: z.number(),
		meshUploadCost: z.number(),
		objectAccountLevel: z.number(),
		oneTimeEventAllowed: z.number(),
		oneTimeEventCost: z.number(),
		partnerFee: z.number(),
		phoneSupport: z.number(),
		picksLimit: z.number(),
		placePages: z
			.object({
				additionalListingCost: z.number(),
				numFreeListings: z.number(),
			})
			.partial(),
		premiumAccess: z.number(),
		premiumAlts: z.number(),
		premiumGifts: z.number(),
		priorityEntry: z.number(),
		repeatingEventsCost: z.number(),
		scriptLimit: z.number(),
		signupBonus: z.number(),
		soundUploadCost: z.number(),
		stipend: z.number(),
		storedImLimit: z.number(),
		largeTextureUploadCost: z.array(z.number()),
		textureUploadCost: z.number(),
		transactionHistoryLimit: z.number(),
		unpartnerFee: z.number(),
		useAnimesh: z.number(),
		voiceMorphing: z.number(),
	})
	.partial()

export const loginResponseSchema = z.preprocess(
	(value) => {
		const formatted = camelCaseKeysDeep(value)

		if ("login" in formatted) {
			formatted.login = formatted.login === "true"
		}

		return formatted
	},
	z.discriminatedUnion("login", [
		z
			.object({
				agentAccess: z.string(),
				message: z.string(),
				maxAgentGroups: z.number(),
				openidUrl: z.string(),
				openidToken: z.string(),
				cofVersion: z.number(),
				agentAppearanceService: z.string(),
				inventoryRoot: z.array(
					z
						.object({
							folderId: z.string(),
						})
						.partial(),
				),
				inventorySkeleton: z.array(
					z
						.object({
							name: z.string(),
							folderId: z.string(),
							parentId: z.string(),
							typeDefault: z.number(),
							version: z.number(),
						})
						.partial(),
				),
				agentAccessMax: z.string(),
				agentRegionAccess: z.string(),
				premiumPackages: z.record(
					z.string(),
					z.object({
						benefits: premiumPackageBenefitsSchema,
						description: z
							.object({ name: z.record(z.string(), z.string()) })
							.partial(),
					}),
				),
				buddyList: z.array(
					z
						.object({
							buddyId: z.string(),
							buddyRightsHas: z.number(),
							buddyRightsGiven: z.number(),
						})
						.partial(),
				),
				mapServerUrl: z.string(),
				loginFlags: z.array(
					z
						.object({
							stipendSinceLogin: z.string(),
							everLoggedIn: z.string(),
							gendered: z.string(),
							daylightSavings: z.string(),
						})
						.partial(),
				),
				udpBlacklist: z.preprocess(
					(value) => (typeof value === "string" ? value.split(",") : value),
					z.array(z.string()),
				),
				accountLevelBenefits: premiumPackageBenefitsSchema,
				accountType: z.string(),
				lindenStatusCode: z.string(),
				agentFlags: z.number(),
				maxGodLevel: z.number(),
				godLevel: z.number(),
				lookAt: vectorSchema,
				regionX: z.number(),
				regionY: z.number(),
				homeInfo: z
					.object({
						regionHandle: regionHandleSchema,
						position: vectorSchema,
						lookAt: vectorSchema,
					})
					.partial(),
				home: z.string(),
				secondsSinceEpoch: z.number(),
				secureSessionId: z.string(),
				seedCapability: z.string(),
				startLocation: z.string(),
			})
			.partial()
			.extend({
				login: z.literal(true),
				circuitCode: z.number(),
				simIp: z.string(),
				simPort: z.number(),
				agentId: z.string(),
				sessionId: z.string(),
				firstName: z
					.string()
					.transform((value) =>
						/^"[a-z0-9 ]+"$/i.test(value) ? value.replace(/"/g, "") : value,
					),
				lastName: z.string(),
			}),

		z.object({
			login: z.literal(false),
			message: z.string(),
		}),
	]),
)

export type LoginResponse = z.infer<typeof loginResponseSchema>

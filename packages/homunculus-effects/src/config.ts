import { Config } from "effect"

export const loginConfig = Config.all({
	url: Config.withDefault(
		Config.url("SL_LOGIN_URL"),
		"https://login.agni.lindenlab.com/cgi-bin/login.cgi",
	),
	username: Config.string("SL_USERNAME"),
	password: Config.redacted("SL_PASSWORD"),
	start: Config.withDefault(
		Config.string("SL_START").pipe(
			Config.validate({
				validation: (value) =>
					!value ||
					["home", "last"].includes(value) ||
					/^uri:[a-z0-9 ]+&\d{1,3}&\d{1,3}&\d{1,4}$/i.test(value),
				message:
					'Start must be either "home" or "last" or a valid URI (i.e. "uri:Bug Island&116&70&4")',
			}),
		),
		"last",
	),
	mfaToken: Config.withDefault(Config.redacted("SL_MFA_TOKEN"), undefined),
	mfaHash: Config.withDefault(Config.redacted("SL_MFA_HASH"), undefined),
	agreeToTos: Config.withDefault(Config.boolean("SL_AGREE_TO_TOS"), undefined),
	readCritical: Config.withDefault(
		Config.boolean("SL_READ_CRITICAL"),
		undefined,
	),
	additionalLoginOptions: Config.withDefault(
		Config.array(Config.string(), "SL_ADDITIONAL_LOGIN_OPTIONS"),
		undefined,
	),
})

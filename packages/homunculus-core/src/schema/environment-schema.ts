import { z } from "zod/v4"

export const proxyOptionsSchema = z
	.object({
		host: z.string().min(1, "Proxy host must be specified"),
		port: z.coerce
			.number()
			.int()
			.min(1, "Proxy port must be at least 1")
			.max(65535, "Proxy port must be between 1 and 65535"),
	})
	.optional()

export const loginOptionsSchema = z.object({
	username: z
		.string()
		.min(1, "Username must be at least 1 character")
		.regex(/^[a-zA-Z0-9 ]+$/, "Username must be alphanumeric")
		.refine(
			(value) => value.split(" ").length < 3,
			"Username must be at most 2 words",
		),

	password: z.string().min(1, "Password must be at least 1 character"),

	start: z
		.string()
		.optional()
		.default("last")
		.refine(
			(value) =>
				!value ||
				["home", "last"].includes(value) ||
				/^uri:[a-z0-9 ]+&\d{1,3}&\d{1,3}&\d{1,4}$/i,
			'Start must be either "home" or "last" or a valid URI (i.e. "uri:Bug Island&116&70&4")',
		),
})

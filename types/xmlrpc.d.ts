import xmlrpc from "xmlrpc"

declare module "xmlrpc" {
	interface ClientOptions {
		url?: string
		headers?: { [header: string]: string }
		rejectUnauthorized?: boolean
	}
}

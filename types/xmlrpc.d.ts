import xmlrpc from "xmlrpc"

declare module "xmlrpc" {
	// tslint:disable-next-line:interface-name
	interface ClientOptions {
		url?: string
		headers?: { [header: string]: string }
		rejectUnauthorized?: boolean
	}
}

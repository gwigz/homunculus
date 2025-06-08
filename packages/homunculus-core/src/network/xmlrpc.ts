import { fromXml, toXml } from "~/network/helpers/xml"

export async function xmlRpc(
	url: string,
	method: string,
	params: Record<string, unknown>,
	headers: Record<string, string>,
) {
	const xml =
		'<?xml version="1.0"?>' +
		toXml({
			methodCall: {
				methodName: method,
				params: {
					param: {
						value: {
							struct: {
								member: Object.entries(params).map(([key, value]) => ({
									name: key,
									value:
										value === undefined
											? undefined
											: Array.isArray(value)
												? {
														array: {
															data: {
																value: value.map((item) => ({
																	string: item,
																})),
															},
														},
													}
												: { [typeof value]: value },
								})),
							},
						},
					},
				},
			},
		})

	const response = await fetch(url, {
		headers: {
			"Content-Type": "text/xml",
			Accept: "text/xml",
			"Accept-Charset": "utf-8",
			...headers,
		},
		method: "POST",
		body: xml,
	})

	return fromXml(await response.text())
}

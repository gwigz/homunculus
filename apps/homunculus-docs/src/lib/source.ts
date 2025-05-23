import { loader } from "fumadocs-core/source"
import { icons } from "lucide-react"
import { createElement } from "react"
import { docs } from "@/.source"
import { i18n } from "@/lib/i18n"

// see https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
	// it assigns a URL to your pages
	i18n,
	baseUrl: "/docs",
	source: docs.toFumadocsSource(),
	icon(icon) {
		if (icon && icon in icons) {
			return createElement(icons[icon as keyof typeof icons])
		}
	},
})

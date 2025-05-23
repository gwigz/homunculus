import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"
import { i18n } from "@/lib/i18n"

/**
 * Shared layout configurations
 *
 * You can customize layouts individually from:
 *
 * - Home Layout: app/[lang]/(home)/layout.tsx
 * - Docs Layout: app/[lang]/docs/layout.tsx
 */
export function baseOptions(_lang: string): BaseLayoutProps {
	return {
		i18n,
		nav: {
			title: (
				<>
					<span className="font-bold font-oswald uppercase">homunculus</span>
				</>
			),
			transparentMode: "top",
		},
		githubUrl: "https://github.com/gwigz/homunculus",
	}
}

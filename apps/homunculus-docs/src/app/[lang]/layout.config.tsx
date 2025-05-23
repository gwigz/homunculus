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
					<svg
						width="24"
						height="24"
						xmlns="http://www.w3.org/2000/svg"
						aria-label="Homunculus"
					>
						<circle cx={12} cy={12} r={12} fill="currentColor" />
					</svg>
					<span className="font-bold">homunculus</span>
				</>
			),
			transparentMode: "top",
		},
		githubUrl: "https://github.com/gwigz/homunculus",
	}
}

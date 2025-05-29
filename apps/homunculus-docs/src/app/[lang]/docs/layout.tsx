import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { ReactNode } from "react"
import { source } from "@/lib/source"
import { baseOptions } from "../layout.config"

export default async function Layout({
	params,
	children,
}: {
	params: Promise<{ lang: string }>
	children: ReactNode
}) {
	const { lang } = await params

	return (
		<DocsLayout
			{...baseOptions(lang)}
			// @ts-expect-error
			tree={source.pageTree[lang]}
			sidebar={{
				tabs: {
					transform(option, node) {
						const meta = source.getNodeMeta(node)

						if (!meta || !node.icon) {
							return option
						}

						const color = `var(--${meta.file.dirname}-color, var(--color-fd-foreground))`

						return {
							...option,
							icon: (
								<div
									className="m-px rounded-lg border p-1.5 shadow-lg ring-2 [&_svg]:size-6.5 md:[&_svg]:size-5"
									style={
										{
											color,
											borderColor: `color-mix(in oklab, ${color} 50%, transparent)`,
											"--tw-ring-color": `color-mix(in oklab, ${color} 20%, transparent)`,
										} as object
									}
								>
									{node.icon}
								</div>
							),
						}
					},
				},
			}}
		>
			{children}
		</DocsLayout>
	)
}

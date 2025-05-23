import * as Twoslash from "fumadocs-twoslash/ui"
import * as TabsComponents from "fumadocs-ui/components/tabs"
import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import { Mermaid } from "@/components/mdx/mermaid"

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		...TabsComponents,
		...Twoslash,
		Mermaid,
		...components,
	}
}

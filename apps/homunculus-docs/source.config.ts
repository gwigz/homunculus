import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins"
import {
	defineConfig,
	defineDocs,
	frontmatterSchema,
	metaSchema,
} from "fumadocs-mdx/config"
import { transformerTwoslash } from "fumadocs-twoslash"
import { createFileSystemTypesCache } from "fumadocs-twoslash/cache-fs"
import { createGenerator, remarkAutoTypeTable } from "fumadocs-typescript"

const generator = createGenerator()

// you can customize Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
	docs: {
		schema: frontmatterSchema,
	},
	meta: {
		schema: metaSchema,
	},
})

export default defineConfig({
	mdxOptions: {
		rehypeCodeOptions: {
			langs: ["js", "ts"],
			themes: {
				light: "github-light",
				dark: "github-dark",
			},
			transformers: [
				...(rehypeCodeDefaultOptions.transformers ?? []),
				transformerTwoslash({
					twoslashOptions: {
						compilerOptions: {
							paths: {
								"@gwigz/homunculus-core": [
									"../../packages/homunculus-core/src",
								],
								"@gwigz/homunculus-bot": ["../../packages/homunculus-bot/src"],
							},
						},
					},
					typesCache: createFileSystemTypesCache(),
				}),
			],
		},
		remarkPlugins: [[remarkAutoTypeTable, { generator }]],
	},
})

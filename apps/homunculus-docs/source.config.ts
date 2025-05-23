import {
	defineConfig,
	defineDocs,
	frontmatterSchema,
	metaSchema,
} from "fumadocs-mdx/config"
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
		remarkPlugins: [[remarkAutoTypeTable, { generator }]],
	},
})

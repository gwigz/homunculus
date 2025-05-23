import { createRelativeLink } from "fumadocs-ui/mdx"
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
	EditOnGitHub,
} from "fumadocs-ui/page"
import { notFound } from "next/navigation"
import { createMetadata } from "@/lib/metadata"
import { source } from "@/lib/source"
import { getMDXComponents } from "@/mdx-components"

export default async function Page({
	params,
}: {
	params: Promise<{ lang: string; slug?: string[] }>
}) {
	const { slug, lang } = await params
	const page = source.getPage(slug, lang)

	if (!page) {
		notFound()
	}

	const MDXContent = page.data.body

	return (
		<DocsPage
			tableOfContent={{ style: "clerk" }}
			toc={page.data.toc}
			full={page.data.full}
		>
			<DocsTitle>{page.data.title}</DocsTitle>

			<DocsDescription className="mb-0">
				{page.data.description}
			</DocsDescription>

			<div className="mb-4 flex flex-row items-center gap-2">
				<EditOnGitHub
					href={`https://github.com/gwigz/homunculus/blob/main/apps/homunculus-docs/content/docs/${page.file.path}`}
				/>
			</div>

			<DocsBody>
				<MDXContent
					components={getMDXComponents({
						// this allows you to link to other pages with relative file paths
						a: createRelativeLink(source, page),
					})}
				/>
			</DocsBody>
		</DocsPage>
	)
}

export async function generateStaticParams() {
	return source.generateParams()
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug?: string[]; lang: string }>
}) {
	const { slug = [], lang } = await params
	const page = source.getPage(slug)

	if (!page) {
		notFound()
	}

	const image = ["/", lang, "/docs-og", ...slug, "image.png"].join("/")

	return createMetadata({
		title: page.data.title,
		description: page.data.description,
		openGraph: {
			images: image,
		},
		twitter: {
			card: "summary_large_image",
			images: image,
		},
	})
}

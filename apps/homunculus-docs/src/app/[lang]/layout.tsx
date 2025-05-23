import "./global.css"

import { Banner } from "fumadocs-ui/components/banner"
// import type { Translations } from "fumadocs-ui/i18n"
import { RootProvider } from "fumadocs-ui/provider"
import { Inter, Oswald } from "next/font/google"
import { baseUrl, createMetadata } from "@/lib/metadata"

const inter = Inter({ subsets: ["latin"] })

const oswald = Oswald({
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-oswald",
})

// // translations
// const cn: Partial<Translations> = {
// 	search: "Translated Content",
// }

// available languages that will be displayed on UI
// make sure `locale` is consistent with your i18n config
const locales = [
	{
		name: "English",
		locale: "en",
	},
]

export const metadata = createMetadata({
	title: {
		template: "%s | homunculus",
		default: "homunculus",
	},
	description: "Third-party library for interacting with Second Life",
	metadataBase: baseUrl,
})

export default async function RootLayout({
	params,
	children,
}: {
	params: Promise<{ lang: string }>
	children: React.ReactNode
}) {
	const lang = (await params).lang

	return (
		<html
			lang={lang}
			className={`${inter.className} ${oswald.variable}`}
			suppressHydrationWarning
		>
			<body className="flex min-h-screen flex-col">
				<RootProvider
					i18n={{
						locale: lang,
						locales,
						// translations: { cn }[lang],
					}}
				>
					<Banner id="wip" className="border-b">
						<span className="font-normal">
							Be careful, this project is still in <strong>very early</strong>{" "}
							development!
						</span>
					</Banner>
					{children}
				</RootProvider>
			</body>
		</html>
	)
}

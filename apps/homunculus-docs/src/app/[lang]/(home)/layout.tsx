import { HomeLayout } from "fumadocs-ui/layouts/home"
import type { ReactNode } from "react"
import { baseOptions } from "@/app/[lang]/layout.config"

export default function Layout({ children }: { children: ReactNode }) {
	return <HomeLayout {...baseOptions}>{children}</HomeLayout>
}

import { DynamicLink } from "fumadocs-core/dynamic-link"

export default function HomePage() {
	return (
		<main className="flex flex-1 flex-col justify-center text-center">
			<h1 className="mb-4 font-bold font-oswald text-5xl uppercase">
				homunculus
			</h1>
			<p className="text-fd-muted-foreground">
				Not much to see here yet, visit{" "}
				<DynamicLink
					href="/[lang]/docs/core"
					className="font-semibold text-fd-foreground underline"
				>
					/docs/core
				</DynamicLink>{" "}
				to see what (if anything) is available.
			</p>
		</main>
	)
}

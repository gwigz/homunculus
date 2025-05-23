import Link from "next/link"

export default function HomePage() {
	return (
		<main className="flex flex-1 flex-col justify-center text-center">
			<h1 className="mb-4 font-bold text-2xl">Hello World</h1>
			<p className="text-fd-muted-foreground">
				Not much to see here yet, visit{" "}
				<Link
					href="/docs"
					className="font-semibold text-fd-foreground underline"
				>
					/docs
				</Link>{" "}
				to see what (if anything) is available.
			</p>
		</main>
	)
}

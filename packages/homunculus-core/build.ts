import { type BuildConfig, build } from "bun"
import dts from "bun-plugin-dts"

const defaultBuildConfig: BuildConfig = {
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	packages: "external",
}

await Promise.all([
	build({
		...defaultBuildConfig,
		plugins: [dts()],
		format: "esm",
		naming: "[dir]/[name].js",
		target: "node",
	}),
	build({
		...defaultBuildConfig,
		format: "cjs",
		naming: "[dir]/[name].cjs",
		target: "node",
	}),
])

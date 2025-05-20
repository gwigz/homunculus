import { type BuildConfig, build } from "bun"
import dts from "bun-plugin-dts"

const defaultBuildConfig: BuildConfig = {
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
}

await Promise.all([
	build({
		...defaultBuildConfig,
		plugins: [dts()],
		format: "esm",
		naming: "[dir]/[name].js",
	}),
	build({
		...defaultBuildConfig,
		format: "cjs",
		naming: "[dir]/[name].cjs",
	}),
])

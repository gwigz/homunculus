import { useStdout } from "ink"
import { useCallback, useEffect, useState } from "react"

export function useScreenSize(onResize?: () => void) {
	const { stdout } = useStdout()

	const getSize = useCallback(
		() => [stdout.columns, stdout.rows] as [width: number, height: number],
		[stdout],
	)

	const [dimensions, setDimensions] = useState(getSize)

	useEffect(() => {
		const handler = () => {
			setDimensions(getSize())
			onResize?.()
		}

		stdout.on("resize", handler)

		return () => {
			stdout.off("resize", handler)
		}
	}, [stdout, getSize, onResize])

	return dimensions
}

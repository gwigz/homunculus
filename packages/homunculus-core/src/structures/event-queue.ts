import z from "zod/v4"
import type { Client } from "~/client"
import { LLSD } from "~/network/helpers/llsd"

export interface EventQueueMessage {
	message: string
	body: unknown
}

export interface EventQueueResponse {
	events: EventQueueMessage[]
	id: number | string
}

export class EventQueue {
	private static readonly CONTENT_TYPE = "application/llsd+xml"

	// retry constants matching second life viewer
	private static readonly EVENT_POLL_ERROR_RETRY_SECONDS = 15
	private static readonly EVENT_POLL_ERROR_RETRY_SECONDS_INC = 5
	private static readonly MAX_EVENT_POLL_HTTP_ERRORS = 10

	// HTTP timeout matching second life viewer (60 seconds)
	private static readonly HTTP_REQUEST_TIMEOUT_MS = 60 * 1000

	private isRunning = false
	private isDone = false

	private acknowledgeId: number | string | undefined
	private abortController: AbortController | null = null
	private pollInterval: NodeJS.Timeout | null = null
	private errorCount = 0

	private readonly eventQueueResponseSchema = z.object({
		events: z
			.array(
				z.object({
					message: z.string(),
					body: z.unknown(),
				}),
			)
			.optional()
			.default([]),
		id: z.union([z.number(), z.string()]).optional(),
	})

	constructor(
		private readonly client: Client,
		private readonly eventQueueUrl: string,
		private readonly messageHandler: (
			message: EventQueueMessage,
		) => void = () => {},
	) {}

	public start() {
		if (this.isRunning) {
			console.warn("EventQueue is already running")
			return
		}

		this.isRunning = true
		this.isDone = false
		this.acknowledgeId = undefined
		this.errorCount = 0

		console.log("EventQueue: starting event polling")

		this.scheduleNextPoll()
	}

	public stop() {
		if (!this.isRunning) {
			return
		}

		console.log("EventQueue: stopping event polling")

		this.isDone = true
		this.isRunning = false

		if (this.pollInterval) {
			clearTimeout(this.pollInterval)
			this.pollInterval = null
		}

		if (this.abortController) {
			this.abortController.abort()
			this.abortController = null
		}
	}

	private scheduleNextPoll() {
		if (!this.isRunning || this.isDone) {
			return
		}

		this.pollInterval = setTimeout(() => {
			this.performEventPoll()
		}, 0)
	}

	private async performEventPoll() {
		if (!this.isRunning || this.isDone) {
			return
		}

		const requestBody = { ack: this.acknowledgeId, done: this.isDone }

		this.abortController = new AbortController()

		try {
			console.log("EventQueue: posting and waiting for response")

			// prepare headers matching Second Life viewer configuration
			const headers: Record<string, string> = {
				Accept: EventQueue.CONTENT_TYPE,
				"Content-Type": EventQueue.CONTENT_TYPE,
				// ...(this.udpPort && {
				// 	"X-SecondLife-UDP-Listen-Port": this.udpPort.toString(),
				// }),
			}

			// combine manual abort controller with timeout signal
			const timeoutSignal = AbortSignal.timeout(
				EventQueue.HTTP_REQUEST_TIMEOUT_MS,
			)

			const combinedSignal = this.abortController
				? AbortSignal.any([this.abortController.signal, timeoutSignal])
				: timeoutSignal

			const response = await fetch(this.eventQueueUrl, {
				method: "POST",
				body: LLSD.formatXml(requestBody),
				headers,
				signal: combinedSignal,
			})

			// handle different http status codes
			if (response.status === 404) {
				// event polling has been canceled by server
				console.warn("EventQueue: server returned 404, canceling polling")

				return this.stop()
			}

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`)
			}

			const text = (await response.text()).trim()

			// handle timeout responses (empty or minimal response)
			if (!text) {
				console.log("EventQueue: empty response (timeout), continuing...")

				// timeouts are treated as normal operation - reset error count
				this.errorCount = 0
				this.scheduleNextPoll()

				return
			}

			const result = this.parseEventQueueResponse(text)

			if (!result) {
				console.warn("EventQueue: invalid response format, continuing...")

				// parsing errors are treated as normal operation - reset error count
				this.errorCount = 0
				this.scheduleNextPoll()

				return
			}

			// successful response - reset error count
			this.errorCount = 0

			// update acknowledge id for next request
			this.acknowledgeId = result.id

			// process events
			if (result.events && result.events.length > 0) {
				console.log(
					`EventQueue: processing ${result.events.length} events (id: ${result.id})`,
				)

				for (const event of result.events) {
					if (event.message) {
						try {
							this.messageHandler(event)
						} catch (error) {
							console.error("EventQueue: error handling message:", error)
						}
					}
				}
			}

			// schedule next poll
			this.scheduleNextPoll()
		} catch (error) {
			if (!(error instanceof Error)) {
				console.error("EventQueue: unknown error:", error)
				return
			}

			// handle specific error types
			if (error.name === "AbortError") {
				console.log("EventQueue: request was aborted")
				return
			}

			// handle timeout as normal operation (matches Second Life viewer behavior)
			if (
				error.name === "TimeoutError" ||
				// error.code === "ETIMEDOUT" ||
				error.message?.includes("timeout") ||
				error.message?.includes("signal timed out")
			) {
				console.log("EventQueue: request timed out (normal), continuing...")

				// timeouts are treated as normal operation - reset error count
				this.errorCount = 0
				this.scheduleNextPoll()

				return
			}

			// actual error occurred - increment error count
			this.errorCount++

			console.warn(
				`EventQueue: request failed (error ${this.errorCount}):`,
				error.message,
			)

			// check if we should retry or give up
			if (this.errorCount < EventQueue.MAX_EVENT_POLL_HTTP_ERRORS) {
				// calculate retry delay: base + (errorCount * increment)
				const retryDelaySeconds =
					EventQueue.EVENT_POLL_ERROR_RETRY_SECONDS +
					this.errorCount * EventQueue.EVENT_POLL_ERROR_RETRY_SECONDS_INC

				console.warn(
					`EventQueue: retrying in ${retryDelaySeconds} seconds (error count: ${this.errorCount})`,
				)

				// schedule retry after delay
				this.pollInterval = setTimeout(() => {
					this.performEventPoll()
				}, retryDelaySeconds * 1000)
			} else {
				// max errors reached - stop polling
				console.error(
					`EventQueue: max errors (${EventQueue.MAX_EVENT_POLL_HTTP_ERRORS}) reached, stopping polling`,
				)

				this.stop()
			}
		} finally {
			this.abortController = null
		}
	}

	private parseEventQueueResponse(text: string) {
		try {
			const parsed = LLSD.parseXml(text)
			const result = this.eventQueueResponseSchema.parse(parsed)

			if (result.id === undefined) {
				throw new Error("EventQueue: response missing id field")
			}

			return result as EventQueueResponse
		} catch (error) {
			console.error("EventQueue: failed to parse response:", error)
		}

		return null
	}
}

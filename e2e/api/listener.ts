interface BasicEvent {
	event?: string;
	data?: unknown;
	id?: string;
}

class BasicServerEventListener implements AsyncDisposable, Disposable {
	private url: string;
	private eventQueue: BasicEvent[] = [];
	private resolveNextEvent: ((event: BasicEvent) => void) | null = null;
	private isDisposed = false;
	private abortController: AbortController;
	private streamReader: ReadableStreamDefaultReader<Uint8Array> | null = null;
	private textDecoder = new TextDecoder();
	private currentData: string = '';
	private currentEvent: BasicEvent = {};

	constructor(url: string) {
		this.url = url;
		this.abortController = new AbortController();
		this.connect();
	}

	public get events(): readonly BasicEvent[] {
		return [...this.eventQueue];
	}

	public get isClosed(): boolean {
		return !this.streamReader;
	}

	private async connect(): Promise<void> {
		try {
			const response = await fetch(this.url, {
				headers: {
					Accept: 'text/event-stream',
				},
				signal: this.abortController.signal,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			if (!response.body) {
				throw new Error('No response body');
			}

			this.streamReader = response.body.getReader();

			while (!this.isDisposed) {
				const { done, value } = await this.streamReader.read();

				if (done) {
					// if (!this.isDisposed) {
					//     console.warn(`SSE stream for ${this.url} closed unexpectedly.`);
					// }
					break;
				}

				if (value) {
					const chunkText = this.textDecoder.decode(value, { stream: true });
					this.processSSEChunk(chunkText);
				}
			}
		} catch (error: unknown) {
			if (error instanceof Error && error.name === 'AbortError') {
				// Silently ignore abort errors as we asked for the abort
				// console.log(`Fetch request for ${this.url} aborted.`, error);
			} else if (!this.isDisposed) {
				console.error(`Error connecting to SSE source at ${this.url}:`, error);
				this.queueEvent({ event: 'error', data: error instanceof Error ? error.message : error, id: undefined });
			}
		} finally {
			this.disconnect();
		}
	}

	private processSSEChunk(chunk: string): void {
		const lines = chunk.split('\n');
		for (const line of lines) {
			// console.log(`SSE line: ${JSON.stringify(line)}`);
			if (line.startsWith(':')) {
				continue;
			}

			if (line.startsWith('data:')) {
				this.currentData += line.substring(5).trim() + '\n';
				// console.log(`Current data: ${this.currentData}`);
			} else if (line.startsWith('event:')) {
				this.currentEvent.event = line.substring(6).trim();
				// console.log(`Current event: ${this.currentEvent.event}`);
			} else if (line.startsWith('id:')) {
				this.currentEvent.id = line.substring(3).trim();
				// console.log(`Current id: ${this.currentEvent.id}`);
			} else if (line.trim() === '') {
				if (this.currentData) {
					// console.log('Parsing data')
					const data = this.parseData(this.currentData.trim());
					this.currentEvent.data = data;
					this.currentData = '';
				}
				this.finalizeEvent();
			} else {
				console.warn(`Unknown SSE line: ${line}`);
			}
		}
	}

	private finalizeEvent(): void {
		if (Object.keys(this.currentEvent).length > 0) {
			// console.log(`Finalizing event: ${JSON.stringify(this.currentEvent)}`);
			this.queueEvent(this.currentEvent);
			this.currentEvent = {};
		}
		this.currentData = '';
	}

	private parseData(dataString: string): unknown {
		try {
			return JSON.parse(dataString);
		} catch {
			return dataString;
		}
	}

	private queueEvent(event: BasicEvent): void {
		// console.log(`Queueing event: ${JSON.stringify(event)}`);
		if (this.isDisposed) return;
		if (this.resolveNextEvent) {
			this.resolveNextEvent(event);
			this.resolveNextEvent = null;
		} else {
			this.eventQueue.push(event);
		}
	}

	async waitForNextEvent(timeoutMs?: number): Promise<BasicEvent> {
		if (this.eventQueue.length > 0) {
			return this.eventQueue.shift()!;
		}
		if (this.resolveNextEvent) {
			throw new Error('waitForNextEvent already in progress');
		}

		return new Promise<BasicEvent>((resolve, reject) => {
			this.resolveNextEvent = (event) => {
				resolve(event);
				this.resolveNextEvent = null;
			};

			if (timeoutMs) {
				setTimeout(() => {
					if (this.resolveNextEvent) {
						reject(new Error('Timeout waiting for next event'));
						this.resolveNextEvent = null;
					}
				}, timeoutMs);
			}
		});
	}

	private disconnect(): void {
		if (this.streamReader) {
			this.streamReader.releaseLock();
			this.streamReader = null;
		}
	}

	async [Symbol.asyncDispose](): Promise<void> {
		if (this.isDisposed) return;
		this.isDisposed = true;
		this.abortController.abort();
		this.disconnect();

		if (this.resolveNextEvent) {
			throw new Error('Listener was disposed while waiting for next event');
		}
	}

	[Symbol.dispose](): void {
		if (this.isDisposed) return;
		this.isDisposed = true;
		this.abortController.abort();
		this.disconnect();

		if (this.resolveNextEvent) {
			throw new Error('Listener was disposed while waiting for next event');
		}
	}
}

export async function createListener(baseURL: string, token?: string) {
	token = token || Math.random().toString(36).substring(2) + '-test';
	const listener = new BasicServerEventListener(baseURL + 'listen/' + token);
	return {
		get token() {
			return token;
		},
		get events() {
			return listener.events;
		},
		get isClosed() {
			return listener.isClosed;
		},
		waitForNextEvent(timeoutMs?: number): Promise<BasicEvent> {
			return listener.waitForNextEvent(timeoutMs);
		},
		async [Symbol.asyncDispose](): Promise<void> {
			await listener[Symbol.asyncDispose]();
		},
		[Symbol.dispose](): void {
			listener[Symbol.dispose]();
		},
	};
}

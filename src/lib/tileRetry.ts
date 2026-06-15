import maplibre from 'maplibre-gl';

// Tile requests are routed through a custom MapLibre protocol so transient failures (network
// errors, 5xx, 429) are refetched with exponential backoff instead of leaving a hole in the map.
// Missing tiles (other 4xx, e.g. outside a historical map's coverage) fail immediately.
const PROTOCOL = 'tile-retry';
const MAX_ATTEMPTS = 4;
const BASE_DELAY_MS = 500;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let registered = false;

// Register the protocol once. Idempotent, so it's safe to call from module-importing code paths.
export function registerTileRetryProtocol(): void {
	if (registered) return;
	registered = true;

	maplibre.addProtocol(PROTOCOL, async (params, abortController) => {
		const url = params.url.slice(`${PROTOCOL}://`.length);
		for (let attempt = 0; ; attempt++) {
			try {
				const response = await fetch(url, { signal: abortController.signal });
				if (response.status >= 500 || response.status === 429) {
					throw new Error(`HTTP ${response.status} for ${url}`);
				}
				if (!response.ok) {
					return Promise.reject(new Error(`HTTP ${response.status} for ${url}`));
				}
				return {
					data: await response.arrayBuffer(),
					cacheControl: response.headers.get('Cache-Control') ?? undefined,
					expires: response.headers.get('Expires') ?? undefined
				};
			} catch (err) {
				if (abortController.signal.aborted || attempt + 1 >= MAX_ATTEMPTS) throw err;
				await delay(BASE_DELAY_MS * 2 ** attempt);
			}
		}
	});
}

// Wrap a tile URL template so MapLibre routes its requests through the retry protocol.
// An empty input stays empty (an absent layer URL).
export function withTileRetry(url: string): string {
	return url ? `${PROTOCOL}://${url}` : '';
}

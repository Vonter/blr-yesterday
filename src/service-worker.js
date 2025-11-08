// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Ensures that the `$service-worker` import has proper type definitions
/// <reference types="@sveltejs/kit" />

import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

registerRoute(
	/\/.*\.(?:jpg|json|png)$/,
	new StaleWhileRevalidate({
		cacheName: 'static',
		plugins: [
			new ExpirationPlugin({
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
				purgeOnQuotaError: true
			}),
			new CacheableResponsePlugin({
				statuses: [200]
			})
		]
	})
);

// Use CacheFirst strategy for tiles
registerRoute(
	({ url }) =>
		url.hostname.includes('maps.blryesterday.com') ||
		url.hostname.includes('tile.openstreetmap.org') ||
		url.hostname.includes('server.arcgisonline.com') ||
		url.hostname.includes('wayback.maptiles.arcgis.com'),
	new CacheFirst({
		cacheName: 'tiles',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200, 404]
			}),
			new ExpirationPlugin({
				maxEntries: 10000, // 10,000 tiles
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
				purgeOnQuotaError: true
			})
		]
	})
);

// Use NetworkFirst strategy for navigation requests
registerRoute(
	({ request }) => request.mode === 'navigate',
	new NetworkFirst({
		cacheName: 'index',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [200]
			})
		]
	})
);

<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import maplibre from 'maplibre-gl';
	import Drawer from './Drawer.svelte';
	import { page } from '$app/stores';
	import { config } from '$lib/config';
	import type { YearData } from '$lib/config';

	let mapContainer: HTMLDivElement;
	let map: maplibre.Map;
	let showHistoricalMap = true;
	let historicalMapOpacity = 1;

	const dispatch = createEventDispatcher<{
		showAbout: void;
	}>();

	// Load configuration
	const bounds: maplibre.LngLatBoundsLike = config.mapConfig.bounds;
	const defaultYearIndex = config.mapConfig.defaultYearIndex;
	let availableYears: YearData[] = config.availableYears;

	let enabledYears = availableYears.filter((year) => year.default !== false);
	let currentYearIndex = Math.min(defaultYearIndex, enabledYears.length - 1);
	let backgroundYearIndex = availableYears.length - 1;
	$: currentYear = enabledYears[currentYearIndex]?.year;
	$: backgroundYear = availableYears[backgroundYearIndex]?.year;

	$: if (map) {
		// Wait for map to be ready
		map.once('load', () => {
			map.setPaintProperty('foreground', 'raster-opacity', historicalMapOpacity);
		});
	}

	// Initialize map
	onMount(() => {
		// Get URL parameters
		const params = $page.url.searchParams;
		const urlYear = params.get('year');
		const urlZoom = params.get('zoom');
		const urlLat = params.get('lat');
		const urlLng = params.get('lng');

		// Set initial map state from URL parameters if available
		const initialZoom = urlZoom ? parseFloat(urlZoom) : config.mapConfig.initialZoom;
		const initialCenter =
			urlLat && urlLng ? [parseFloat(urlLng), parseFloat(urlLat)] : config.mapConfig.initialCenter;
		const initialYear = urlYear ? parseInt(urlYear) : currentYear;

		// Set urlYear default to true
		availableYears = availableYears.map((y) => ({
			...y,
			default: y.year === initialYear ? true : y.default
		}));
		enabledYears = availableYears.filter((y) => y.default !== false);
		currentYearIndex = enabledYears.findIndex((year) => year.year === initialYear);
		currentYear = enabledYears[currentYearIndex].year;

		map = new maplibre.Map({
			container: mapContainer,
			style: {
				version: 8,
				sources: {
					'osm-tiles': {
						type: 'raster',
						tiles: getTileUrl(backgroundYear),
						tileSize: 256,
						attribution: '© OpenStreetMap contributors'
					},
					'historical-map': {
						type: 'raster',
						tiles: getTileUrl(initialYear),
						tileSize: 256,
						attribution: '© Survey of India',
						maxzoom: 19,
						minzoom: 10
					}
				},
				layers: [
					{
						id: 'background',
						type: 'raster',
						source: 'osm-tiles',
						paint: {
							'raster-opacity': 0.75
						}
					},
					{
						id: 'foreground',
						type: 'raster',
						source: 'historical-map',
						paint: {
							'raster-opacity': historicalMapOpacity,
							'raster-fade-duration': 300
						}
					}
				]
			},
			center: initialCenter,
			zoom: initialZoom,
			attributionControl: false,
			maxBounds: bounds,
			preserveDrawingBuffer: true,
			cancelPendingTileRequestsWhileZooming: false,
			maxTileCacheZoomLevels: 10
		});

		// Add geolocate control to the map.
		const geolocateControl = new maplibre.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			},
			trackUserLocation: true
		});
		map.addControl(geolocateControl, 'bottom-right');

		// Handle geolocation errors
		geolocateControl.on('error', () => {
			let errorMessage =
				'Failed to access GPS location. Please ensure location access is enabled. Reload the page when enabled.';
			alert(errorMessage);
		});

		// Add attribution
		map.addControl(new maplibre.AttributionControl(), 'bottom-left');

		// Enable keyboard navigation
		window.addEventListener('keydown', handleKeydown);

		// Update URL parameters when map state changes
		map.on('moveend', updateURLParams);
		map.on('zoomend', updateURLParams);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			map.remove();
		};
	});

	let updateTimeout: ReturnType<typeof setTimeout>;

	// Update map source when year changes with debounce
	$: if (map && currentYear && enabledYears[currentYearIndex]) {
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(() => {
			const source = map.getSource('historical-map') as maplibre.RasterTileSource;
			if (source) {
				source.tiles = getTileUrl(currentYear);
				source.setTiles(getTileUrl(currentYear));
			}

			// Update URL parameters
			updateURLParams();
		}, 50); // Decreased debounce delay for more responsive UI
	}

	// Toggle historical map visibility
	$: if (map) {
		const layer = map.getLayer('foreground');
		if (layer) {
			map.setPaintProperty('foreground', 'raster-opacity', historicalMapOpacity);

			if (showHistoricalMap) {
				map.setLayoutProperty('foreground', 'visibility', 'visible');
			} else {
				map.setLayoutProperty('foreground', 'visibility', 'none');
			}
		}
	}

	// Get tile URL based on year
	function getTileUrl(year: number): string[] {
		if (year == 2999) {
			return [`https://tile.openstreetmap.org/{z}/{x}/{y}.png`];
		}
		return [availableYears.find((y) => y.year === year)?.url || ''];
	}

	// Handle keyboard navigation with debounce
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft' && currentYearIndex > 0) {
			currentYearIndex--;
		} else if (event.key === 'ArrowRight' && currentYearIndex < enabledYears.length - 1) {
			currentYearIndex++;
		}
	}

	// Update URL parameters
	function updateURLParams() {
		const center = map.getCenter();
		const zoom = map.getZoom();
		const params = new URLSearchParams();
		params.set('zoom', zoom.toFixed(2));
		params.set('lat', center.lat.toFixed(4));
		params.set('lng', center.lng.toFixed(4));
		params.set('year', currentYear.toString());
		window.history.replaceState({}, '', `${location.pathname}?${params}`);
	}

	// Update map source when background year changes
	$: if (map && backgroundYear) {
		const source = map.getSource('osm-tiles') as maplibre.RasterTileSource;
		if (source) {
			source.tiles = getTileUrl(backgroundYear);
			source.setTiles(getTileUrl(backgroundYear));
		}
	}
</script>

<div class="absolute bottom-0 left-0 right-0 h-full">
	<div bind:this={mapContainer} class="absolute bottom-0 left-0 right-0 h-full"></div>

	<button
		class="absolute bottom-2 left-2.5 z-10 flex h-[29px] w-[29px] items-center justify-center rounded-md bg-white/95 shadow-md transition-colors duration-200 hover:bg-zinc-50 dark:bg-neutral-900/95 dark:text-neutral-200 dark:hover:bg-neutral-800/95"
		on:click={() => dispatch('showAbout')}
		aria-label="Show the about drawer"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
			/>
		</svg>
	</button>

	<Drawer
		bind:enabledYears
		bind:currentYearIndex
		bind:showHistoricalMap
		bind:historicalMapOpacity
		bind:backgroundYearIndex
		{availableYears}
	/>
</div>

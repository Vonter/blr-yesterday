<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import maplibre from 'maplibre-gl';
	import Drawer from './Drawer.svelte';
	import { page } from '$app/stores';

	let mapContainer: HTMLDivElement;
	let map: maplibre.Map;
	let showHistoricalMap = true;

	let historicalMapOpacity = 1;

	const dispatch = createEventDispatcher<{
		showAbout: void;
	}>();

	// Available years with descriptions
	const availableYears = [
		{ year: 1791, label: '1790' },
		{ year: 1843, label: '1840' },
		{ year: 1854, label: '1850' },
		{ year: 1884, label: '1880' },
		{ year: 1898, label: '1900' },
		{ year: 1910, label: '1910' },
		{ year: 1948, label: '1940' },
		{ year: 1969, label: '1960' },
		{ year: 1983, label: '1980' },
		{ year: 2002, label: '2000 (City)' },
		{ year: 2003, label: '2000 (Region)' },
		{ year: 2009, label: 'Late 2000s' },
		{ year: 2015, label: '2015' },
		{ year: 2025, label: 'Today' },
		{ year: 2999, label: 'OpenStreetMap' }
	];
	const bounds: maplibre.LngLatBoundsLike = [
		[77, 12.5], // Southwest coordinates
		[78.5, 13.5] // Northeast coordinates
	];

	let enabledYears = availableYears.filter(
		(year) => ![1910, 2009, 2015, 2999].includes(year.year)
	);
	let currentYearIndex = 5;
	$: currentYear = enabledYears[currentYearIndex].year;

	$: if (map) {
		map.setPaintProperty('foreground', 'raster-opacity', historicalMapOpacity);
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
		const initialZoom = urlZoom ? parseFloat(urlZoom) : 14;
		const initialCenter: maplibre.LngLatLike =
			urlLat && urlLng ? [parseFloat(urlLng), parseFloat(urlLat)] : [77.59, 12.98];
		const initialYear = urlYear ? parseInt(urlYear) : currentYear;

		// Find the index of the initial year in enabledYears, default to index 6 if not found
		const yearIndex = enabledYears.findIndex((yearData) => yearData.year === initialYear);
		currentYearIndex = yearIndex >= 0 ? yearIndex : 6;
		currentYear = enabledYears[currentYearIndex].year;

		map = new maplibre.Map({
			container: mapContainer,
			style: {
				version: 8,
				sources: {
					'osm-tiles': {
						type: 'raster',
						tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
						tileSize: 256,
						attribution: '© OpenStreetMap contributors'
					},
					'historical-map': {
						type: 'raster',
						tiles: getTileUrl(initialYear),
						tileSize: 256,
						attribution: '© Survey of India'
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
							'raster-opacity': historicalMapOpacity
						}
					}
				]
			},
			center: initialCenter,
			zoom: initialZoom,
			attributionControl: false,
			maxBounds: bounds
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
	$: if (map && currentYear) {
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(() => {
			const source = map.getSource('historical-map') as maplibre.RasterTileSource;
			if (source) {
				source.tiles = getTileUrl(currentYear);
				source.setTiles(getTileUrl(currentYear));
			}
		}, 10); // 10ms debounce delay
	}

	// Toggle historical map visibility
	$: if (map) {
		const layer = map.getLayer('foreground');
		if (layer) {
			if (showHistoricalMap) {
				map.setLayoutProperty('foreground', 'visibility', 'visible');
			} else {
				map.setLayoutProperty('foreground', 'visibility', 'none');
			}
		}
	}

	// Get tile URL based on year
	function getTileUrl(year: number): string[] {
		if (year < 2009) {
			return [`https://maps.blryesterday.com/${year}/{z}/{x}/{y}.png`];
		} else if (year == 2009) {
			return [
				`https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{z}/{y}/{x}`
			];
		} else if (year == 2015) {
			return [
				`https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/31026/{z}/{y}/{x}`
			];
		} else if (year == 2025) {
			return [
				`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
			];
		} else {
			return [`https://tile.openstreetmap.org/{z}/{x}/{y}.png`];
		}
	}

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft' && currentYearIndex > 0) {
			currentYearIndex--;
		} else if (event.key === 'ArrowRight' && currentYearIndex < availableYears.length - 1) {
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
</script>

<div class="absolute bottom-0 left-0 right-0 h-full">
	<div bind:this={mapContainer} class="absolute bottom-0 left-0 right-0 h-full"></div>
	<button
		class="absolute bottom-2 left-2 z-10 flex h-[29px] w-[29px] items-center justify-center rounded-md bg-white/95 shadow-md transition-colors duration-200 hover:bg-zinc-50 dark:bg-neutral-900/95 dark:text-neutral-200 dark:hover:bg-neutral-800/95"
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
		{availableYears}
	/>
</div>

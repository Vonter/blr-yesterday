<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import maplibre from 'maplibre-gl';
	import Slider from './Slider.svelte';

	let mapContainer;
	let map;
	let yearSlider;
	let showHistoricalMap = true;

	const dispatch = createEventDispatcher<{
		showAbout: void;
	}>();

	// Available years with descriptions
	const availableYears = [
		{ year: 1791, label: '1790' },
		{ year: 1843, label: '1840' },
		{ year: 1854, label: '1850' },
		{ year: 1898, label: '1900' },
		{ year: 1910, label: '1910' },
		{ year: 1940, label: '1940' },
		{ year: 2002, label: '2000' },
		{ year: 2009, label: '2005' },
		{ year: 2015, label: '2015' },
		{ year: 2024, label: 'Today' }
	];
	const bounds = [
		[77, 12.5], // Southwest coordinates
		[78.5, 13.5] // Northeast coordinates
	];
	let currentYearIndex = 5;
	$: currentYear = availableYears[currentYearIndex].year;

	// Initialize map
	onMount(() => {
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
						tiles: [`https://maps.blryesterday.com/${currentYear}/{z}/{x}/{y}.png`],
						tileSize: 256,
						attribution: '© Survey of India'
					}
				},
				layers: [
					{
						id: 'osm-layer',
						type: 'raster',
						source: 'osm-tiles',
						paint: {
							'raster-opacity': 0.3
						}
					},
					{
						id: 'historical-map-layer',
						type: 'raster',
						source: 'historical-map',
						paint: {
							'raster-opacity': 1
						}
					}
				]
			},
			center: [77.59, 12.98],
			zoom: 14,
			attributionControl: false,
			maxBounds: bounds
		});

		// Add geolocate control to the map.
		map.addControl(
			new maplibre.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true
				},
				trackUserLocation: true
			}),
			'bottom-right'
		);

		// Add attribution
		map.addControl(new maplibre.AttributionControl(), 'bottom-left');

		// Enable keyboard navigation
		window.addEventListener('keydown', handleKeydown);

		// Preload tiles
		let preloadTimeout;
		const preloadTiles = () => {
			const bounds = map.getBounds();
			const zoom = Math.floor(map.getZoom());

			// Convert bounds to tile coordinates using lat/lon calculations
			const n = Math.PI - (2 * Math.PI * bounds.getNorth()) / 360;
			const s = Math.PI - (2 * Math.PI * bounds.getSouth()) / 360;
			const w = (bounds.getWest() * Math.PI) / 180;
			const e = (bounds.getEast() * Math.PI) / 180;

			// Calculate tile coordinates
			const zoomFactor = Math.pow(2, zoom);
			const tileBounds = {
				minX: Math.floor(((w + Math.PI) * zoomFactor) / (2 * Math.PI)),
				maxX: Math.ceil(((e + Math.PI) * zoomFactor) / (2 * Math.PI)),
				minY: Math.floor(
					((Math.log(Math.tan(Math.PI / 4 + n / 2)) + Math.PI) * zoomFactor) / (2 * Math.PI)
				),
				maxY: Math.ceil(
					((Math.log(Math.tan(Math.PI / 4 + s / 2)) + Math.PI) * zoomFactor) / (2 * Math.PI)
				)
			};

			// Load tiles in viewport and surrounding area
			const sourceCache = map.getSource('historical-map') as maplibre.RasterTileSource;
			if (!sourceCache) return;

			// Limit the number of tiles to preload
			const maxTilesToLoad = 256;
			let tilesLoaded = 0;

			for (let x = tileBounds.minX - 1; x <= tileBounds.maxX + 1; x++) {
				for (let y = tileBounds.minY - 1; y <= tileBounds.maxY + 1; y++) {
					if (tilesLoaded >= maxTilesToLoad) return;

					// Check if tile is already loaded
					const tileID = { x, y, z: zoom };
					const loadedTile = sourceCache.hasTile(tileID);
					if (!loadedTile || loadedTile.state !== 'loaded') {
						sourceCache.loadTile({
							tileID,
							state: 'loading'
						});
						tilesLoaded++;
					}
				}
			}
		};

		// Preload during movement with throttling
		map.on('move', () => {
			if (preloadTimeout) {
				clearTimeout(preloadTimeout);
			}
			preloadTimeout = setTimeout(preloadTiles, 100);
		});

		// Preload after movement ends
		map.on('moveend', preloadTiles);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			if (preloadTimeout) {
				clearTimeout(preloadTimeout);
			}
			map.remove();
		};
	});

	// Update map source when year changes
	$: if (map && currentYear) {
		const source = map.getSource('historical-map');
		if (source) {
			let tiles;
			if (currentYear < 2009) {
				tiles = [`https://maps.blryesterday.com/${currentYear}/{z}/{x}/{y}.png`];
			} else if (currentYear == 2009) {
				tiles = [
					`https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{z}/{y}/{x}`
				];
			} else if (currentYear == 2015) {
				tiles = [
					`https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/31026/{z}/{y}/{x}`
				];
			} else {
				tiles = [
					`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
				];
			}

			// Update the source tiles
			source.setTiles(tiles);
		}
	}

	// Toggle historical map visibility
	$: if (map) {
		const layer = map.getLayer('historical-map-layer');
		if (layer) {
			if (showHistoricalMap) {
				map.setLayoutProperty('historical-map-layer', 'visibility', 'visible');
			} else {
				map.setLayoutProperty('historical-map-layer', 'visibility', 'none');
			}
		}
	}

	// Handle keyboard navigation
	function handleKeydown(event) {
		if (event.key === 'ArrowLeft' && currentYearIndex > 0) {
			currentYearIndex--;
		} else if (event.key === 'ArrowRight' && currentYearIndex < availableYears.length - 1) {
			currentYearIndex++;
		}
	}
</script>

<div class="absolute bottom-0 left-0 right-0 h-full">
	<div bind:this={mapContainer} class="absolute bottom-0 left-0 right-0 h-full" />
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

	<Slider bind:currentYearIndex bind:showHistoricalMap {availableYears} />
</div>

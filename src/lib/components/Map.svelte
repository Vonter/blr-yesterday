<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import maplibre from 'maplibre-gl';

	let mapContainer;
	let map;
	let yearSlider;
	let showHistoricalMap = true;

	const dispatch = createEventDispatcher();

	// Available years with descriptions
	const availableYears = [
		{ year: 1854, label: '1850' },
		{ year: 1884, label: '1880' },
		{ year: 1898, label: '1900' },
		{ year: 1948, label: '1940' },
		{ year: 1969, label: '1960' },
		{ year: 1983, label: '1980' },
		{ year: 2002, label: '2000' },
		{ year: 2009, label: '2005' },
		{ year: 2024, label: '2024' }
	];
	const bounds = [
		[77, 12.5], // Southwest coordinates
		[78.5, 13.5] // Northeast coordinates
	];
	let currentYearIndex = 4;
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
						tiles: [`https://maps.vonter.in/${currentYear}/{z}/{x}/{y}.png`],
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

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			map.remove();
		};
	});

	// Update map source when year changes
	$: if (map && currentYear) {
		const source = map.getSource('historical-map');
		if (source) {
			let tiles;
			if (currentYear < 2009) {
				tiles = [`https://maps.vonter.in/${currentYear}/{z}/{x}/{y}.png`];
			} else if (currentYear == 2009) {
				tiles = [
					`https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{z}/{y}/{x}`
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

	<div
		class="absolute bottom-2 left-1/2 z-10 min-w-[280px] max-w-[90vw] -translate-x-1/2 rounded-lg bg-white/95 p-3 shadow-md backdrop-blur-md sm:min-w-[240px] md:p-4 dark:bg-neutral-900/95"
	>
		<div class="flex items-center justify-between gap-4">
			<div class="flex flex-col items-center">
				<button
					class="text-gray-600 hover:text-gray-900 disabled:opacity-50 dark:text-neutral-400 dark:hover:text-neutral-200"
					on:click={() => (currentYearIndex = Math.max(0, currentYearIndex - 1))}
					disabled={currentYearIndex === 0}
					aria-label="Previous year"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
				{#if currentYearIndex > 0}
					<span class="mt-1 text-xs text-gray-500 dark:text-neutral-500">
						{availableYears[currentYearIndex - 1].label}
					</span>
				{/if}
			</div>

			<div class="flex flex-col items-center">
				<div class="text-xl font-semibold text-gray-900 md:text-lg dark:text-neutral-200">
					{availableYears[currentYearIndex].label}
				</div>
				<button
					class="mt-1 text-gray-600 dark:text-neutral-400"
					on:click={() => (showHistoricalMap = !showHistoricalMap)}
					aria-label={showHistoricalMap ? 'Hide historical map' : 'Show historical map'}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						{#if showHistoricalMap}
							<path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
							<path
								fill-rule="evenodd"
								d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
								clip-rule="evenodd"
							/>
						{:else}
							<path
								d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z"
							/>
							<path
								d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z"
							/>
							<path
								d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z"
							/>
						{/if}
					</svg>
				</button>
			</div>

			<div class="flex flex-col items-center">
				<button
					class="text-gray-600 hover:text-gray-900 disabled:opacity-50 dark:text-neutral-400 dark:hover:text-neutral-200"
					on:click={() =>
						(currentYearIndex = Math.min(availableYears.length - 1, currentYearIndex + 1))}
					disabled={currentYearIndex === availableYears.length - 1}
					aria-label="Next year"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
				{#if currentYearIndex < availableYears.length - 1}
					<span class="mt-1 text-xs text-gray-500 dark:text-neutral-500">
						{availableYears[currentYearIndex + 1].label}
					</span>
				{/if}
			</div>
		</div>

		<div class="mt-3 flex items-center justify-center gap-1">
			{#each availableYears as year, i}
				<div
					class="h-1 rounded-full transition-all duration-200 {i === currentYearIndex
						? 'w-6 bg-gray-800 dark:bg-neutral-200'
						: 'w-3 bg-gray-300 dark:bg-neutral-700'}"
					title={year.label}
				/>
			{/each}
		</div>
	</div>
</div>

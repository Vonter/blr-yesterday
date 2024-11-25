<script>
	import { onMount } from 'svelte';
	import maplibre from 'maplibre-gl';

	let mapContainer;
	let map;
	let yearSlider;

	// Available years
	const availableYears = [1854, 1884, 1898, 1935, 1948, 1969, 1983];
	let currentYearIndex = 3;
	$: currentYear = availableYears[currentYearIndex];

	// Initialize map
	onMount(() => {
		map = new maplibre.Map({
			container: mapContainer,
			style: {
				version: 8,
				sources: {
					'historical-map': {
						type: 'raster',
						tiles: [`https://maps.vonter.in/${currentYear}/{z}/{x}/{y}.png`],
						tileSize: 256
					}
				},
				layers: [
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
			attributionControl: false
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

		return () => {
			map.remove();
		};
	});

	// Update map source when year changes
	$: if (map && currentYear) {
		const source = map.getSource('historical-map');
		map.style.sourceCaches['historical-map'].update(map.transform);
		if (source) {
			source.setTiles([`https://maps.vonter.in/${currentYear}/{z}/{x}/{y}.png`]);
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

	<div
		class="absolute bottom-2 left-1/2 z-10 min-w-[280px] max-w-[90vw] -translate-x-1/2 rounded-lg bg-white/95 p-3 shadow-md backdrop-blur-md sm:min-w-[240px] md:p-4"
	>
		<div class="mb-2 text-center text-xl font-semibold text-gray-900 md:text-lg">
			{currentYear}
		</div>
		<div class="flex items-center gap-2">
			<div class="flex w-full flex-col gap-2">
				<input
					id="year-slider"
					type="range"
					bind:value={currentYearIndex}
					min={0}
					max={availableYears.length - 1}
					step={1}
					bind:this={yearSlider}
					on:keydown={handleKeydown}
					class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
					aria-label="Select year"
				/>
				<div class="flex justify-between px-2">
					{#each availableYears as _, index}
						<div
							key={index}
							class={`h-1 w-1 rounded-full transition-all ${
								index === { currentYearIndex } ? 'scale-150 bg-blue-600' : 'bg-gray-300'
							}`}
						/>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

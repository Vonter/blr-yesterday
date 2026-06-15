<script lang="ts">
	import { onMount } from 'svelte';
	import maplibre from 'maplibre-gl';
	import Drawer from './Drawer.svelte';
	import MediaPanel from './MediaPanel.svelte';
	import MediaPins from './MediaPins.svelte';
	import { page } from '$app/state';
	import { config, PINS_DEFAULT_ON, withPriorityItems } from '$lib/config';
	import type { YearData, MediaPin } from '$lib/config';
	import { registerTileRetryProtocol, withTileRetry } from '$lib/tileRetry';

	let { onShowAbout }: { onShowAbout?: () => void } = $props();

	registerTileRetryProtocol();

	let mapContainer: HTMLDivElement;
	let map = $state<maplibre.Map>();
	let showHistoricalMap = $state(true);
	let historicalMapOpacity = $state(1);
	let isRotated = $state(false);

	// Geolocated multimedia pins. MediaPins owns the on-map markers; we hold the canonical
	// selected/hovered state here and feed the active pin (selection wins over hover) to the panel.
	let showPins = $state(PINS_DEFAULT_ON);
	// Replaced wholesale (never mutated in place); $state.raw avoids deep-proxying every pin and
	// the per-property dependency subscriptions that MediaPins' marker-render effect would create.
	let mediaPins = $state.raw<MediaPin[]>([]);
	let selectedPin = $state<MediaPin | null>(null);
	let hoveredPin = $state<MediaPin | null>(null);
	let mapZoom = $state(config.mapConfig.initialZoom);

	// On touch, MapLibre's synthesized map 'click' can fire a tick after a marker's DOM click,
	// so selecting a pin would null the panel and immediately reopen it (a visible flash). Record
	// when a pin was tapped and let the background-dismiss handler ignore that trailing click.
	let lastPinSelectAt = 0;
	function selectPin(pin: MediaPin | null) {
		selectedPin = pin;
		lastPinSelectAt = performance.now();
	}

	// Load configuration
	const bounds: maplibre.LngLatBoundsLike = config.mapConfig.bounds;
	const defaultYearIndex = config.mapConfig.defaultYearIndex;
	// Year lists are immutable config snapshots, only ever reassigned (filtered/remapped), so
	// $state.raw skips deep-proxying them as they flow down through Drawer/Settings/TimelineYears.
	let availableYears = $state.raw<YearData[]>(config.availableYears);

	const initialEnabledYears = config.availableYears.filter((year) => year.default !== false);
	let enabledYears = $state.raw(initialEnabledYears);
	let currentYearIndex = $state(Math.min(defaultYearIndex, initialEnabledYears.length - 1));
	let backgroundYearIndex = $state(config.availableYears.length - 1);
	let currentYear = $derived(enabledYears[currentYearIndex]?.year);
	let backgroundYear = $derived(availableYears[backgroundYearIndex]?.year);

	let activePin = $derived(withPriorityItems(selectedPin ?? hoveredPin, currentYear));

	// Initialize map
	onMount(() => {
		// Get URL parameters
		const params = page.url.searchParams;
		const urlYear = params.get('year');
		const urlZoom = params.get('zoom');
		const urlLat = params.get('lat');
		const urlLng = params.get('lng');

		// Set initial map state from URL parameters if available
		const initialZoom = urlZoom ? parseFloat(urlZoom) : config.mapConfig.initialZoom;
		const initialCenter: [number, number] =
			urlLat && urlLng ? [parseFloat(urlLng), parseFloat(urlLat)] : config.mapConfig.initialCenter;
		const initialYear = urlYear ? parseInt(urlYear) : currentYear;

		// Set urlYear default to true
		availableYears = availableYears.map((y) => ({
			...y,
			default: y.year === initialYear ? true : y.default
		}));
		enabledYears = availableYears.filter((y) => y.default !== false);
		currentYearIndex = enabledYears.findIndex((year) => year.year === initialYear);

		const instance = new maplibre.Map({
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
			cancelPendingTileRequestsWhileZooming: false,
			maxTileCacheZoomLevels: 10
		});
		map = instance;

		// Add geolocate control to the map.
		const geolocateControl = new maplibre.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			},
			trackUserLocation: true
		});
		instance.addControl(geolocateControl, 'bottom-right');

		// Handle geolocation errors
		geolocateControl.on('error', () => {
			let errorMessage =
				'Failed to access GPS location. Please ensure location access is enabled. Reload the page when enabled.';
			alert(errorMessage);
		});

		// Compass control — hidden while the map faces north, shown via the `map-rotated`
		// container class once the user rotates/tilts, so orientation resets with one click.
		instance.addControl(
			new maplibre.NavigationControl({ showZoom: false, showCompass: true, visualizePitch: true }),
			'bottom-right'
		);

		const updateRotationState = () => {
			isRotated = instance.getBearing() !== 0 || instance.getPitch() !== 0;
		};
		instance.on('rotate', updateRotationState);
		instance.on('pitch', updateRotationState);

		// Track zoom continuously — pin visibility and inline media depend on it
		mapZoom = instance.getZoom();
		instance.on('zoom', () => (mapZoom = instance.getZoom()));

		// Add attribution
		instance.addControl(new maplibre.AttributionControl(), 'bottom-left');

		// Load geolocated multimedia metadata (fail-soft, like the /daily page)
		fetch('/media.json')
			.then((response) => (response.ok ? response.json() : { pins: [] }))
			.then((data) => {
				mediaPins = Array.isArray(data?.pins) ? data.pins : [];
			})
			.catch(() => {
				mediaPins = [];
			});

		// Clicking the map background dismisses any pinned panel — unless this click is the trailing
		// synthesized one from a pin tap (see lastPinSelectAt), which would flash the panel closed.
		instance.on('click', () => {
			if (performance.now() - lastPinSelectAt < 350) return;
			selectedPin = null;
		});

		// Enable keyboard navigation
		window.addEventListener('keydown', handleKeydown);

		// Update URL parameters when map state changes
		instance.on('moveend', updateURLParams);
		instance.on('zoomend', updateURLParams);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			instance.remove();
		};
	});

	let updateTimeout: ReturnType<typeof setTimeout>;

	// Update map source when year changes with debounce
	$effect(() => {
		if (map && currentYear && enabledYears[currentYearIndex]) {
			const m = map;
			clearTimeout(updateTimeout);
			updateTimeout = setTimeout(() => {
				const source = m.getSource('historical-map') as maplibre.RasterTileSource;
				if (source) {
					source.tiles = getTileUrl(currentYear);
					source.setTiles(getTileUrl(currentYear));
				}

				// Update URL parameters
				updateURLParams();
			}, 50); // Decreased debounce delay for more responsive UI
		}
	});

	// Toggle historical map visibility. Hiding drives raster-opacity to 0 rather than flipping
	// layer visibility: MapLibre leaves a raster layer blank after visibility returns to
	// 'visible' until the next map move (hence it only reappeared on zoom), whereas an opacity
	// change repaints immediately and animates through the layer's raster-fade-duration.
	$effect(() => {
		// Read the reactive values up front, before the map-readiness guard. On this effect's
		// first run `map` is freshly assigned but its style hasn't loaded, so getLayer() is null;
		// if these were only read inside the guard the effect would short-circuit before touching
		// them, never subscribe, and later toggle/slider changes would not re-run it.
		const opacity = showHistoricalMap ? historicalMapOpacity : 0;
		const m = map;
		if (!m) return;
		const apply = () => {
			if (m.getLayer('foreground')) {
				m.setPaintProperty('foreground', 'raster-opacity', opacity);
			}
		};
		if (m.isStyleLoaded()) {
			apply();
		} else {
			m.once('load', apply);
		}
	});

	// Get tile URL based on year, routed through the retry protocol
	function getTileUrl(year: number): string[] {
		const url =
			year == 2999
				? `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
				: availableYears.find((y) => y.year === year)?.url || '';
		return [withTileRetry(url)];
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
		if (!map) return;
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
	$effect(() => {
		if (map && backgroundYear) {
			const source = map.getSource('osm-tiles') as maplibre.RasterTileSource;
			if (source) {
				source.tiles = getTileUrl(backgroundYear);
				source.setTiles(getTileUrl(backgroundYear));
			}
		}
	});
</script>

<div class="absolute bottom-0 left-0 right-0 h-full">
	<div
		bind:this={mapContainer}
		class="absolute bottom-0 left-0 right-0 h-full"
		class:map-rotated={isRotated}
	></div>

	<button
		class="absolute bottom-2 left-2.5 z-10 flex h-[29px] w-[29px] items-center justify-center rounded-md bg-white/95 shadow-md transition-colors duration-200 hover:bg-zinc-50 dark:bg-neutral-900/95 dark:text-neutral-200 dark:hover:bg-neutral-800/95"
		onclick={() => onShowAbout?.()}
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

	<MediaPins
		{map}
		pins={mediaPins}
		show={showPins}
		zoom={mapZoom}
		year={currentYear}
		selectedId={selectedPin?.id ?? null}
		onhover={(pin) => (hoveredPin = pin)}
		onselect={selectPin}
	/>

	<MediaPanel pin={activePin} />

	<Drawer
		bind:enabledYears
		bind:currentYearIndex
		bind:showHistoricalMap
		bind:historicalMapOpacity
		bind:backgroundYearIndex
		bind:showPins
		{availableYears}
	/>
</div>

<style>
	/* Compass control: only relevant while the map is rotated/tilted. Fade it in via the
	   `map-rotated` class instead of adding/removing the control, keeping its DOM stable. */
	:global(.maplibregl-ctrl-group:has(.maplibregl-ctrl-compass)) {
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.2s ease;
	}

	:global(.map-rotated .maplibregl-ctrl-group:has(.maplibregl-ctrl-compass)) {
		opacity: 1;
		pointer-events: auto;
	}
</style>

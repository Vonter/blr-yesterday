<script lang="ts">
	import { onDestroy } from 'svelte';
	import maplibre from 'maplibre-gl';
	import { MEDIA_BASE, prioritizeItems } from '$lib/config';
	import type { MediaPin } from '$lib/config';

	// Headless component: owns the lifecycle of the multimedia markers MapLibre renders into the
	// map container. It has no DOM of its own — it reports hover/selection back to the parent,
	// which holds the canonical selected/hovered state and drives the MediaPanel.
	let {
		map = undefined,
		pins = [],
		show = true,
		zoom,
		year,
		selectedId = null,
		onhover,
		onselect
	}: {
		map?: maplibre.Map | undefined;
		pins?: MediaPin[];
		show?: boolean;
		zoom: number;
		year: number;
		selectedId?: string | null;
		onhover?: (pin: MediaPin | null) => void;
		onselect?: (pin: MediaPin | null) => void;
	} = $props();

	// Zoom-dependent presentation: hidden when zoomed far out, regular teardrop markers in the mid
	// range, and the media itself rendered inline on the map when zoomed far in.
	const PIN_MIN_ZOOM = 13;
	const PIN_INLINE_ZOOM = 16;
	type DisplayMode = 'hidden' | 'marker' | 'inline';
	let mode = $derived(
		(!show || zoom < PIN_MIN_ZOOM
			? 'hidden'
			: zoom > PIN_INLINE_ZOOM
				? 'inline'
				: 'marker') as DisplayMode
	);

	// A single, understated marker for every multimedia type — a vintage ink teardrop that sits
	// naturally over old, sepia / line-art maps (no modern per-type glyphs).
	const PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="30" viewBox="0 0 22 30"><path d="M11 1C5.5 1 1 5.3 1 10.6 1 17.9 11 29 11 29s10-11.1 10-18.4C21 5.3 16.5 1 11 1Z" fill="#3a2f24" stroke="#f3e9d2" stroke-width="1.6"/><circle cx="11" cy="10.6" r="3.1" fill="#f3e9d2"/></svg>`;

	let markers: maplibre.Marker[] = [];

	function label(title: string, count: number): string {
		return count > 1 ? `${title} and ${count - 1} more` : title;
	}

	// Outer element is the one MapLibre positions via `transform`, so it must NOT carry any CSS
	// transition (otherwise pins lag/jump while panning & zooming). All visual styling and hover
	// animation live on an inner element instead.
	function createPinElement(pin: MediaPin): HTMLDivElement {
		const el = document.createElement('div');
		el.className = 'media-pin';
		el.setAttribute('role', 'button');
		el.setAttribute('tabindex', '0');
		el.setAttribute('aria-label', label(pin.items[0]?.title ?? '', pin.items.length));

		const icon = document.createElement('div');
		icon.className = 'media-pin__icon';
		icon.innerHTML = PIN_SVG;
		el.appendChild(icon);
		return el;
	}

	// Above PIN_INLINE_ZOOM the marker becomes the media itself: a small framed card showing the
	// pin's priority item, so users can pan around and browse media directly on the map.
	function createInlineElement(pin: MediaPin, forYear: number): HTMLDivElement {
		const item = prioritizeItems(pin.items, forYear)[0];
		const el = document.createElement('div');
		el.className = 'media-inline';
		el.setAttribute('role', 'button');
		el.setAttribute('tabindex', '0');
		el.setAttribute('aria-label', label(item.title, pin.items.length));

		const img = document.createElement('img');
		img.src = MEDIA_BASE + item.file;
		img.alt = item.title;
		img.loading = 'lazy';
		img.draggable = false;
		el.appendChild(img);

		if (pin.items.length > 1) {
			const count = document.createElement('span');
			count.className = 'media-inline__count';
			count.textContent = `${pin.items.length}`;
			el.appendChild(count);
		}
		return el;
	}

	function clear() {
		markers.forEach((marker) => marker.remove());
		markers = [];
	}

	// Rebuild every marker for the given inputs. Selection isn't a dependency, so picking a pin
	// doesn't rebuild the whole layer.
	function render(mode: DisplayMode, pins: MediaPin[], forYear: number) {
		clear();
		if (!map || mode === 'hidden') return;
		for (const pin of pins) {
			if (typeof pin.lat !== 'number' || typeof pin.lng !== 'number') continue;
			if (!Array.isArray(pin.items) || pin.items.length === 0) continue;
			const el = mode === 'inline' ? createInlineElement(pin, forYear) : createPinElement(pin);
			el.addEventListener('mouseenter', () => onhover?.(pin));
			el.addEventListener('mouseleave', () => onhover?.(null));
			el.addEventListener('click', (event) => {
				event.stopPropagation();
				onselect?.(selectedId === pin.id ? null : pin);
			});
			// Teardrop markers point at the location with their tip (bottom anchor); inline media
			// cards sit centered over the location instead.
			const marker = new maplibre.Marker({
				element: el,
				anchor: mode === 'inline' ? 'center' : 'bottom'
			})
				.setLngLat([pin.lng, pin.lat])
				.addTo(map);
			markers.push(marker);
		}
	}

	// Inline cards show the year-dependent priority item; markers don't, so pin the year to 0
	// outside inline mode to avoid rebuilding markers on every year change.
	let renderYear = $derived(mode === 'inline' ? year : 0);
	$effect(() => {
		if (map) render(mode, pins, renderYear);
	});

	// When the layer goes hidden (toggled off or zoomed out), clear any open/hover selection.
	$effect(() => {
		if (mode === 'hidden') {
			onselect?.(null);
			onhover?.(null);
		}
	});

	onDestroy(clear);
</script>

<style>
	/* Markers are appended to the map container, outside this component's DOM, so their styles
	   must be global. They're co-located here because they belong to these markers. */

	/* Outer element: positioned by MapLibre — keep it transition-free. */
	:global(.media-pin) {
		width: 22px;
		height: 30px;
		cursor: pointer;
	}

	/* Invisible 44x44 hit area (minimum touch target size) centered on the pin body, so taps
	   that land slightly off the small glyph still register on mobile. */
	:global(.media-pin)::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 44px;
		height: 44px;
		transform: translate(-50%, -50%);
	}

	:global(.media-pin:focus-visible) {
		outline: none;
	}

	/* Inner element: all visuals + hover animation live here. Scales from the tip (bottom). */
	:global(.media-pin__icon) {
		width: 22px;
		height: 30px;
		transform-origin: bottom center;
		filter: drop-shadow(0 1px 1.5px rgba(0, 0, 0, 0.45));
		transition:
			transform 0.15s ease,
			filter 0.15s ease;
	}

	:global(.media-pin__icon svg) {
		display: block;
	}

	:global(.media-pin:hover .media-pin__icon),
	:global(.media-pin:focus-visible .media-pin__icon) {
		transform: scale(1.15);
		filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.55));
	}

	/* Inline media card (zoom > 16): the priority item rendered directly at the pin location.
	   Like .media-pin, the outer element is positioned by MapLibre, so keep it transition-free
	   and never override its position (maplibregl-marker is absolute; that also serves as the
	   containing block for the count badge). */
	:global(.media-inline) {
		width: 132px;
		cursor: pointer;
	}

	:global(.media-inline img) {
		display: block;
		width: 100%;
		max-height: 148px;
		object-fit: cover;
		border: 2px solid #f3e9d2;
		border-radius: 6px;
		background: #3a2f24;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
	}

	:global(.media-inline__count) {
		position: absolute;
		right: 4px;
		top: 4px;
		border-radius: 9999px;
		background: rgba(0, 0, 0, 0.6);
		padding: 1px 6px;
		font-size: 11px;
		font-weight: 600;
		color: #fff;
	}

	:global(.media-inline:focus-visible) {
		outline: none;
	}

	:global(.media-inline:hover img),
	:global(.media-inline:focus-visible img) {
		box-shadow: 0 3px 9px rgba(0, 0, 0, 0.55);
	}
</style>

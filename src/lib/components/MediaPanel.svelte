<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { crossIn, crossOut, reveal } from '$lib/transitions';
	import { MEDIA_BASE } from '$lib/config';
	import type { MediaItem, MediaPin } from '$lib/config';

	let { pin }: { pin: MediaPin | null } = $props();

	// Transition durations (ms). `motion()` collapses these to 0 under prefers-reduced-motion, so
	// every transition degrades to an instant swap rather than being special-cased per call site.
	const MS = {
		panel: 250, // open/close slide-and-fade
		cross: 110, // pin-to-pin image crossfade (also the caption fade-out, bounded by this unmount)
		caption: 200, // caption fade+slide-in — gentler than the image so the text settles, not flickers
		nav: 200 // prev/next bar reveal — matches the panel's height-resize curve
	};
	const motion = (ms: number) => (prefersReducedMotion.current ? 0 : ms);

	const SOURCE_LABELS: Record<string, string> = {
		'commons.wikimedia.org': 'Wikimedia Commons'
	};

	let scroller = $state<HTMLDivElement | null>(null);
	let slideEls = $state<HTMLDivElement[]>([]);
	let scrollerHeight = $state<number | null>(null);
	let resizeObserver = $state<ResizeObserver | null>(null);
	let currentIndex = $state(0);

	// `pin` is the live selection/hover from the map; we render `displayedPin`, which lags behind it
	// while a newly selected pin's first image downloads. Holding the current image painted until the
	// next one is ready lets the {#key} block crossfade between two real images instead of flashing
	// the empty placeholder mid-download. Opening from nothing or closing swaps at once to stay snappy.
	let displayedPin = $state<MediaPin | null>(null);
	let preloadToken = 0;

	$effect(() => {
		const next = pin;
		if (next?.id === displayedPin?.id) return;

		const firstFile = next?.items[0]?.file;
		if (!next || !displayedPin || !firstFile) {
			displayedPin = next;
			return;
		}

		const token = ++preloadToken;
		const swap = () => {
			if (token === preloadToken) displayedPin = next;
		};
		const img = new Image();
		img.src = MEDIA_BASE + firstFile;
		img.decode().then(swap, swap);
	});

	// Start from the first item whenever a different pin is shown
	let lastDisplayedId: string | null = null;
	$effect(() => {
		if (displayedPin?.id !== lastDisplayedId) {
			lastDisplayedId = displayedPin?.id ?? null;
			currentIndex = 0;
			scroller?.scrollTo({ left: 0 });
		}
	});

	// Slides keep their natural height (items-start) and the scroller animates to match the
	// active slide, so short photos don't leave the panel padded out to the tallest one.
	onMount(() => {
		resizeObserver = new ResizeObserver(updateScrollerHeight);
		return () => resizeObserver?.disconnect();
	});

	$effect(() => observeSlides(slideEls, resizeObserver));

	function observeSlides(els: HTMLDivElement[], observer: ResizeObserver | null) {
		if (!observer) return;
		observer.disconnect();
		for (const el of els) if (el) observer.observe(el);
		updateScrollerHeight();
	}

	function updateScrollerHeight() {
		const el = slideEls[currentIndex];
		if (el) scrollerHeight = el.offsetHeight;
	}

	function handleScroll() {
		if (!scroller || scroller.clientWidth === 0) return;
		currentIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
		updateScrollerHeight();
	}

	function goTo(index: number) {
		if (!scroller || !displayedPin) return;
		const clamped = Math.max(0, Math.min(displayedPin.items.length - 1, index));
		scroller.scrollTo({ left: clamped * scroller.clientWidth, behavior: 'smooth' });
	}

	function sourceLabel(item: MediaItem): string | null {
		if (!item.sourceUrl) return null;
		try {
			const host = new URL(item.sourceUrl).hostname.replace(/^www\./, '');
			return SOURCE_LABELS[host] ?? host;
		} catch {
			return null;
		}
	}

	function placeYear(item: MediaItem): string {
		// place/year may be the literal 'Unknown' (explicitly marked in the CRUD tool); show it,
		// but collapse a duplicate so a doubly-unknown item reads 'Unknown', not 'Unknown, Unknown'.
		const parts = [item.place, item.year].filter(Boolean);
		return [...new Set(parts)].join(', ');
	}
</script>

{#if displayedPin}
	<!-- Eased slide-and-fade on open/close so hovering a pin doesn't pop the panel in abruptly.
	     The transition only runs when the panel appears/disappears, not when hovering directly
	     from one pin to another (the {#if} block stays mounted). -->
	<div
		transition:fly={{ y: motion(16), duration: motion(MS.panel), easing: cubicOut }}
		class="fixed inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden rounded-t-lg bg-white/95 shadow-md backdrop-blur-md md:inset-x-auto md:bottom-auto md:left-2 md:top-2 md:w-[34rem] md:rounded-lg lg:w-[40rem] dark:bg-neutral-900/95"
	>
		<!-- The control bar hugs the panel's anchored edge (bottom on mobile, top on desktop),
		     so the arrows and counter stay put on screen while the slides above/below resize.
		     Hovering between pins crossfades the content: the keyed scroller blocks share one
		     CSS-grid cell (.media-stack) so the outgoing pin fades out while the incoming one
		     fades in over the same spot — no empty gap or flash between the two. -->
		<!-- The animated height lives on this persistent wrapper (not the keyed scroller, which would
		     mount fresh each switch and snap). It clips the overlapping scrollers, so the panel resizes
		     smoothly between differently-sized images during the crossfade. -->
		<div
			class="media-stack order-1 grid overflow-hidden md:order-2"
			style:height={scrollerHeight === null ? 'auto' : `${scrollerHeight}px`}
		>
			{#key displayedPin.id}
				<div
					bind:this={scroller}
					onscroll={handleScroll}
					in:crossIn={{ duration: motion(MS.cross) }}
					out:crossOut={{ duration: motion(MS.cross) }}
					class="media-scroller flex snap-x snap-mandatory items-start overflow-x-auto overflow-y-hidden overscroll-x-contain"
				>
					{#each displayedPin.items as item, index (item.id)}
						<div
							bind:this={slideEls[index]}
							class="max-h-[50vh] w-full shrink-0 snap-center overflow-y-auto md:max-h-[calc(100vh-4rem)]"
						>
							<a
								href={MEDIA_BASE + item.file}
								target="_blank"
								rel="noreferrer"
								class="block bg-gray-100 dark:bg-neutral-800"
							>
								<img
									src={MEDIA_BASE + item.file}
									alt={item.title}
									class="h-auto max-h-[40vh] w-full object-contain md:max-h-[75vh]"
								/>
							</a>

							<div
								class="px-3 py-2.5"
								in:fly|global={{ y: motion(6), duration: motion(MS.caption), easing: cubicOut }}
								out:fade|global={{ duration: motion(MS.cross) }}
							>
								<h2 class="text-sm font-semibold leading-snug text-gray-900 dark:text-neutral-200">
									{item.title}
								</h2>

								<div class="mt-1 flex items-baseline justify-between gap-3 text-xs">
									{#if placeYear(item)}
										<span class="text-gray-500 dark:text-neutral-400">{placeYear(item)}</span>
									{/if}
									{#if sourceLabel(item)}
										<a
											href={item.sourceUrl}
											target="_blank"
											rel="noreferrer"
											class="ml-auto shrink-0 text-gray-400 underline decoration-gray-300 underline-offset-2 hover:text-gray-600 dark:text-neutral-500 dark:decoration-neutral-600 dark:hover:text-neutral-300"
										>
											{sourceLabel(item)}
										</a>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/key}
		</div>

		{#if displayedPin.items.length > 1}
			<div
				transition:reveal={{ duration: motion(MS.nav) }}
				class="order-2 flex shrink-0 items-center justify-between border-t border-gray-200 px-1 py-0.5 md:order-1 md:border-b md:border-t-0 dark:border-neutral-700"
			>
				<button
					class="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
					onclick={() => goTo(currentIndex - 1)}
					disabled={currentIndex === 0}
					aria-label="Previous item"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="size-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
					</svg>
				</button>

				<span class="text-xs font-medium tabular-nums text-gray-500 dark:text-neutral-400">
					{currentIndex + 1} / {displayedPin.items.length}
				</span>

				<button
					class="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
					onclick={() => goTo(currentIndex + 1)}
					disabled={currentIndex === displayedPin.items.length - 1}
					aria-label="Next item"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="size-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
					</svg>
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Overlap the outgoing and incoming keyed scrollers in one cell so they crossfade in
	   place (rather than stacking and shoving the panel around) while hovering between pins. */
	.media-stack > :global(*) {
		grid-area: 1 / 1;
	}

	/* Animate the panel's resize when the active slide's height changes — whether swiping within a
	   pin or crossfading to a differently-sized image in another pin. The crossfade (CROSS_MS)
	   finishes well before this, so the incoming image is fully painted while the panel is still
	   settling its height — the resize reads as the content easing into place rather than racing
	   the fade. easeOutCubic matches the crossfade's easing so both ride the same curve. */
	.media-stack {
		transition: height 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
	}

	/* Match the JS transitions, which collapse to instant under prefers-reduced-motion. */
	@media (prefers-reduced-motion: reduce) {
		.media-stack {
			transition: none;
		}
	}

	/* Swiping is the affordance — hide the horizontal scrollbar. */
	.media-scroller {
		scrollbar-width: none;
	}

	.media-scroller::-webkit-scrollbar {
		display: none;
	}
</style>

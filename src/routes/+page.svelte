<script lang="ts">
	import Map from '../lib/components/Map.svelte';
	let showAboutDrawer = false;
</script>

<Map on:showAbout={() => (showAboutDrawer = true)} />

{#if showAboutDrawer}
	<div
		class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
		on:click={() => (showAboutDrawer = false)}
	>
		<div
			class="fixed bottom-0 left-0 right-0 z-50 h-1/2 overflow-y-auto bg-white/95 p-8 shadow-xl backdrop-blur-md transition-transform lg:left-1/2 lg:right-1/2 lg:w-[800px] lg:-translate-x-1/2 dark:bg-neutral-900/95"
			on:click|stopPropagation
		>
			<button
				class="absolute right-6 top-6 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
				on:click={() => (showAboutDrawer = false)}
				aria-label="Close drawer"
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
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<h2 class="mb-8 text-3xl font-bold tracking-tight dark:text-neutral-200">
				On This Day in BLR
			</h2>

			<div
				class="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-neutral-400"
			>
				<p class="text-lg">
					Explore Bangalore's transformation through historical maps and archival documents.
				</p>

				<div class="space-y-4">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-neutral-200">About the Maps</h3>
					<ul class="list-disc space-y-2 pl-6">
						<li>1850: Published in 1854 (Pharoah & Co., Madras; J. & C. Walker)</li>
						<li>1880: Published in 1884 (Multiple individuals, unknown organization)</li>
						<li>1900: Published in 1935 (John Bartholomew)</li>
						<li>1940: Surveyed 1935-36. Published in 1948 (Survey of India)</li>
						<li>1960: Surveyed 1960-61. Published in 1969 (Survey of India)</li>
						<li>1980: Surveyed 1979-80. Published in 1983 (Survey of India)</li>
						<li>2000: Surveyed 1997-99. Published in 2002 (Survey of India)</li>
						<li>
							2005: Satellite images captured over multiple years through the mid 2000s (ESRI)
						</li>
						<li>2024: Satellite images captured after 2022 (ESRI)</li>
						<li>
							Background: <a
								href="https://openstreetmap.in"
								class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
								>OpenStreetMap</a
							> (OpenStreetMap contributors)
						</li>
					</ul>
				</div>

				<div class="space-y-4">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-neutral-200">How to Use</h3>
					<ul class="list-disc space-y-2 pl-6">
						<li>Use the arrow buttons to switch between different years</li>
						<li>Toggle the eye icon to show/hide the historical map</li>
						<li>Zoom and pan around to explore different areas of the city</li>
						<li>Use the locate button to jump to your current location</li>
					</ul>
				</div>

				<div class="space-y-4">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-neutral-200">
						Want to Contribute?
					</h3>
					<p>
						Interested in helping us improve this project by contributing historical maps or
						documents? Contact us on <a
							href="https://www.instagram.com/blr.on.this.day/"
							class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
							>Instagram</a
						>
						or check out the
						<a
							href="https://github.com/Vonter/blr-otd"
							class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
							>GitHub repository</a
						>.
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	/* Hide the default attribution */
	:global(.maplibregl-ctrl.maplibregl-ctrl-attrib) {
		display: none;
	}

	/* Dark mode */
	@media (prefers-color-scheme: dark) {
		:global(.maplibregl-ctrl) {
			background-color: rgb(24 24 27 / 0.95) !important;
		}

		:global(.maplibregl-ctrl button > span) {
			filter: invert(1);
		}
	}
</style>

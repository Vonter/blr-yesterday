<script lang="ts">
	export let showAboutDrawer: boolean;
</script>

{#if showAboutDrawer}
	<div
		class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
		on:click={() => (showAboutDrawer = false)}
		on:keydown={(e) => e.key === 'Escape' && (showAboutDrawer = false)}
		role="button"
		tabindex="0"
	>
		<div
			class="fixed bottom-0 left-0 right-0 z-50 h-1/2 overflow-y-auto bg-white/95 p-8 shadow-xl backdrop-blur-md transition-transform lg:left-1/2 lg:right-1/2 lg:w-[800px] lg:-translate-x-1/2 dark:bg-neutral-900/95"
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="button"
			tabindex="0"
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

			<h2 class="mb-8 text-3xl font-bold tracking-tight dark:text-neutral-200">BLR Yesterday</h2>

			<div
				class="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-neutral-400"
			>
				<p class="text-lg">
					Explore Bangalore's transformation through historical maps and archival documents.
				</p>

				<div class="space-y-4">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-neutral-200">About the Maps</h3>
					<ul class="list-disc space-y-2 pl-6">
						<li>
							<span class="font-semibold">1790:</span> Published in 1791 (Plan of the Siege of Bangalore,
							Lord Cornwallis)
						</li>
						<li>
							<span class="font-semibold">1840:</span> Published in 1843 (Plan of the Cantonment of Bangalore,
							B.C. Regel)
						</li>
						<li>
							<span class="font-semibold">1850:</span> Published in 1854 (Pharoah & Co., Madras; J. &
							C. Walker)
						</li>
						<li>
							<span class="font-semibold">1880:</span> Published in 1884 (Multiple individuals,
							unknown organization; scans courtesy
							<a
								href="https://mod.org.in/"
								class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
								>Mod Foundation archives</a
							>)
						</li>
						<li><span class="font-semibold">1900:</span> Published in 1935 (John Bartholomew)</li>
						<li>
							<span class="font-semibold">1910:</span> Published in 1910 (Litho. School 2nd Q.V.O.S.
							& M in Bangalore)
						</li>
						<li>
							<span class="font-semibold">1940:</span> Surveyed 1935-36. Published in 1948 (Survey
							of India; scans courtesy
							<a
								href="https://mod.org.in/"
								class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
								>Mod Foundation archives</a
							>)
						</li>
						<li>
							<span class="font-semibold">1960:</span> Surveyed 1960-61. Published in 1969 (Survey
							of India; scans courtesy
							<a
								href="https://mod.org.in/"
								class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
								>Mod Foundation archives</a
							>)
						</li>
						<li>
							<span class="font-semibold">1980:</span> Surveyed 1979-80. Published in 1983 (Survey
							of India; scans courtesy
							<a
								href="https://mod.org.in/"
								class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
								>Mod Foundation archives</a
							>)
						</li>
						<li>
							<span class="font-semibold">2000 (City):</span> Surveyed 1997-99. Published in 2002
							(Survey of India; scans courtesy
							<a
								href="https://bengawalk.com"
								class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
								>Bengawalk</a
							>)
						</li>
						<li>
							<span class="font-semibold">2000 (Region):</span> Surveyed across multiple decades in
							the late 20th Century. Major details updated around 2000. Published in 2011 (Survey of
							India; scans courtesy
							<a
								href="https://bengawalk.com"
								class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
								>Bengawalk</a
							>)
						</li>
						<li>
							<span class="font-semibold">2005:</span> Satellite images captured in different areas across
							multiple years through the 2000s (ESRI)
						</li>
						<li>
							<span class="font-semibold">2015:</span> Satellite images captured in different areas across
							multiple years through the early 2010s (ESRI)
						</li>
						<li>
							<span class="font-semibold">Today:</span> Satellite images captured after 2022 (ESRI)
						</li>
						<li>
							<span class="font-semibold">Background:</span>
							<a
								href="https://openstreetmap.in"
								class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
								>OpenStreetMap</a
							> (OpenStreetMap contributors)
						</li>
					</ul>
				</div>

				<div class="space-y-4">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-neutral-200">
						From the Archives
					</h3>
					<p>Coming Soon!</p>
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
							href="https://github.com/Vonter/blr-yesterday"
							class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
							>GitHub repository</a
						>.
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<script lang="ts">
	import { config } from '$lib/config';

	export let showAboutDrawer: boolean;

	const { siteInfo, aboutContent } = config;
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

			<h2 class="mb-8 text-3xl font-bold tracking-tight dark:text-neutral-200">{siteInfo.name}</h2>

			<div
				class="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-neutral-400"
			>
				<p class="text-lg">
					{aboutContent.introduction}
				</p>

				<div class="space-y-4">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-neutral-200">
						{aboutContent.mapsSection.title}
					</h3>
					<ul class="list-disc space-y-2 pl-6">
						{#each aboutContent.mapsSection.items as item}
							<li>
								<span class="font-semibold">{item.label}:</span>
								{@html item.description}
							</li>
						{/each}
					</ul>
				</div>

				{#if aboutContent.archivesSection}
					<div class="space-y-4">
						<h3 class="text-xl font-semibold text-gray-900 dark:text-neutral-200">
							{aboutContent.archivesSection.title}
						</h3>
						<p>{aboutContent.archivesSection.content}</p>
					</div>
				{/if}

				<div class="space-y-4">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-neutral-200">
						{aboutContent.howToUseSection.title}
					</h3>
					<ul class="list-disc space-y-2 pl-6">
						{#each aboutContent.howToUseSection.items as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>

				<div class="space-y-4">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-neutral-200">
						{aboutContent.contributeSection.title}
					</h3>
					<p>
						{@html aboutContent.contributeSection.content}
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<script lang="ts">
	import { onMount } from 'svelte';
	import { config } from '$lib/config';
	import type { PageData } from './$types';
	import SEO from '$lib/components/SEO.svelte';

	export let data: PageData;

	let isLoading = true;

	onMount(() => {
		isLoading = false;
	});
</script>

<main
	data-vaul-drawer-wrapper
	class="container mx-auto max-w-2xl bg-zinc-50 px-4 py-8 dark:bg-zinc-950"
>
	<SEO 
		title="Daily | {config.siteInfo.name}"
		description="Daily snippets from {config.siteInfo.cityName}'s history"
		keywords="daily, {config.siteInfo.keywords}"
	/>
	<div class="min-h-screen">
		{#if isLoading}
			<div class="flex items-center justify-center py-20">
				<div
					class="h-12 w-12 animate-spin rounded-full border-b-2 border-zinc-900 dark:border-zinc-100"
				></div>
			</div>
		{:else if data.days.length === 0}
			<div class="py-20 text-center">
				<p class="text-lg text-zinc-600 dark:text-zinc-400">
					No daily images available at the moment.
				</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each data.days as day, index}
					{#if day.files.length > 0}
						<article
							class="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
						>
							<!-- Image(s) -->
							<div class="relative">
								{#if day.files.length === 1}
									<img
										src="https://media.blryesterday.com/daily/{day.files[0]}"
										alt={day.description || 'Historical image from Bangalore'}
										class="h-auto w-full"
										loading={index < 3 ? 'eager' : 'lazy'}
									/>
								{:else}
									<!-- Multiple images in a grid -->
									<div
										class="grid {day.files.length === 2
											? 'grid-cols-2'
											: day.files.length === 3
												? 'grid-cols-3'
												: 'grid-cols-2'} gap-2 p-2"
									>
										{#each day.files as file}
											<img
												src="https://media.blryesterday.com/daily/{file}"
												alt={day.description || 'Historical image from Bangalore'}
												class="h-auto w-full rounded"
												loading={index < 3 ? 'eager' : 'lazy'}
											/>
										{/each}
									</div>
								{/if}
							</div>

							<!-- Description -->
							{#if day.description}
								<div class="p-6">
									<p
										class="whitespace-pre-wrap text-base leading-relaxed text-zinc-800 dark:text-zinc-200"
									>
										{day.description}
									</p>
								</div>
							{/if}
						</article>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</main>

<style>
	/* Smooth scroll behavior */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Background color for the entire page */
	:global(body) {
		background-color: rgb(250 250 250); /* zinc-50 */
	}

	:global(body.dark) {
		background-color: rgb(9 9 11); /* zinc-950 */
	}

	@media (prefers-color-scheme: dark) {
		:global(body:not(.light)) {
			background-color: rgb(9 9 11); /* zinc-950 */
		}
	}

	/* Image optimization */
	img {
		image-rendering: -webkit-optimize-contrast;
	}
</style>

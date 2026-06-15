<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { config } from '$lib/config';

	function sheet(_node: HTMLElement, { duration = 300, easing = cubicOut } = {}) {
		return {
			duration,
			easing,
			css: (t: number) => `transform: translateY(${(1 - t) * 100}%);`
		};
	}

	let { showAboutDrawer = $bindable() }: { showAboutDrawer: boolean } = $props();

	const { siteInfo, aboutContent } = config;

	function close() {
		showAboutDrawer = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if showAboutDrawer}
	<div
		class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
		transition:fade={{ duration: 300 }}
		onclick={close}
		role="presentation"
	></div>

	<div
		class="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-1/2 flex-col overflow-hidden rounded-t-xl bg-white/95 shadow-lg backdrop-blur-md md:max-w-2xl dark:bg-neutral-900/95"
		transition:sheet={{ duration: 300 }}
		role="dialog"
		aria-modal="true"
		aria-label={siteInfo.name}
		tabindex="-1"
	>
		<div
			class="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 dark:border-neutral-700 dark:bg-neutral-900/95"
		>
			<h2 class="text-lg font-semibold text-gray-900 sm:text-xl dark:text-neutral-200">
				{siteInfo.name}
			</h2>
			<button
				class="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
				onclick={close}
				aria-label="Close about"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
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
		</div>

		<div class="flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6">
			<p class="text-sm leading-relaxed text-gray-600 dark:text-neutral-400">
				{aboutContent.introduction}
			</p>

			{#if aboutContent.archivesSection}
				<section class="space-y-3">
					<h3
						class="border-b border-gray-200 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-700 dark:border-neutral-700 dark:text-neutral-300"
					>
						{aboutContent.archivesSection.title}
					</h3>
					<p class="text-sm text-gray-600 dark:text-neutral-400">
						{aboutContent.archivesSection.content}
					</p>
				</section>
			{/if}

			<section class="space-y-3">
				<h3
					class="border-b border-gray-200 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-700 dark:border-neutral-700 dark:text-neutral-300"
				>
					{aboutContent.contributeSection.title}
				</h3>
				<p class="text-sm leading-relaxed text-gray-600 dark:text-neutral-400">
					{@html aboutContent.contributeSection.content}
				</p>
			</section>

			<section class="space-y-3">
				<h3
					class="border-b border-gray-200 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-700 dark:border-neutral-700 dark:text-neutral-300"
				>
					{aboutContent.howToUseSection.title}
				</h3>
				<ul class="list-disc space-y-1.5 pl-5 text-sm text-gray-600 dark:text-neutral-400">
					{#each aboutContent.howToUseSection.items as item}
						<li>{item}</li>
					{/each}
				</ul>
			</section>

			<section class="space-y-4">
				<h3
					class="border-b border-gray-200 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-700 dark:border-neutral-700 dark:text-neutral-300"
				>
					{aboutContent.sourcesSection.title}
				</h3>
				<p class="text-sm leading-relaxed text-gray-600 dark:text-neutral-400">
					{aboutContent.sourcesSection.description}{' '}
				</p>

				<div class="space-y-3 border-l-2 border-gray-200 pl-4 dark:border-neutral-700">
					<h4
						class="text-[0.6875rem] font-semibold uppercase tracking-widest text-gray-500 dark:text-neutral-500"
					>
						{aboutContent.mapsSection.title}
					</h4>
					<dl class="divide-y divide-gray-100 text-sm dark:divide-neutral-800">
						{#each aboutContent.mapsSection.items as item}
							<div class="flex gap-3 py-1.5 first:pt-0 last:pb-0">
								<dt class="w-20 shrink-0 font-medium text-gray-700 dark:text-neutral-300">
									{item.label}
								</dt>
								<dd class="text-gray-500 dark:text-neutral-400">
									{@html item.description}
								</dd>
							</div>
						{/each}
					</dl>
				</div>

				<div class="space-y-3 border-l-2 border-gray-200 pl-4 dark:border-neutral-700">
					<h4
						class="text-[0.6875rem] font-semibold uppercase tracking-widest text-gray-500 dark:text-neutral-500"
					>
						{aboutContent.photographsSection.title}
					</h4>
					<p class="text-sm leading-relaxed text-gray-500 dark:text-neutral-400">
						{@html aboutContent.photographsSection.content}
					</p>
				</div>
			</section>
		</div>
	</div>
{/if}

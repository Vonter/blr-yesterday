<script lang="ts">
	import Settings from './Controls/Settings.svelte';
	import HideMap from './Controls/HideMap.svelte';
	import OpacitySlider from './Controls/OpacitySlider.svelte';

	export let currentYearIndex: number;
	export let showHistoricalMap: boolean;
	export let historicalMapOpacity = 1;
	export let enabledYears: { year: number; label: string }[];
	export let availableYears: { year: number; label: string }[];

	let showSettings = false;
	let showHideMapButton = false;
	let showOpacitySlider: boolean;

	function handlePrevYear() {
		currentYearIndex = Math.max(0, currentYearIndex - 1);
	}

	function handleNextYear() {
		currentYearIndex = Math.min(availableYears.length - 1, currentYearIndex + 1);
	}

	function toggleSettings() {
		showSettings = !showSettings;
	}
</script>

<div
	class="absolute bottom-2 left-1/2 z-10 min-w-[280px] max-w-[75vw] -translate-x-1/2 rounded-lg bg-white/95 p-3 shadow-md backdrop-blur-md sm:min-w-[280px] md:p-4 dark:bg-neutral-900/95"
>
	<div class="flex-cols-[1fr_auto_1fr] flex items-center gap-4">
		<div class="flex flex-col items-center">
			<button
				class="text-gray-600 hover:text-gray-900 disabled:opacity-50 dark:text-neutral-400 dark:hover:text-neutral-200"
				on:click={handlePrevYear}
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
			<div class="h-5 w-20 text-center lg:w-24">
				{#if currentYearIndex > 0}
					<span class="text-xs text-gray-500 dark:text-neutral-500">
						{enabledYears[currentYearIndex - 1].label}
					</span>
				{/if}
			</div>
		</div>

		<div
			class="flex w-32 flex-col
		 items-center lg:w-36"
		>
			<div class="text-center text-xl font-semibold text-gray-900 md:text-lg dark:text-neutral-200">
				{enabledYears[currentYearIndex].label}
			</div>
			<div class="mt-0.5 flex items-center justify-center gap-1.5">
				<button
					class="rounded-full p-1 text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200"
					on:click={toggleSettings}
					aria-label="Settings"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-settings"
						><path
							d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
						/><circle cx="12" cy="12" r="3" /></svg
					>
				</button>
				{#if showHideMapButton}
					<HideMap bind:showHistoricalMap />
				{/if}
			</div>
		</div>

		<div class="flex flex-col items-center">
			<button
				class="text-gray-600 hover:text-gray-900 disabled:opacity-50 dark:text-neutral-400 dark:hover:text-neutral-200"
				on:click={handleNextYear}
				disabled={currentYearIndex === enabledYears.length - 1}
				aria-label="Next year"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
			<div class="h-5 w-20 text-center lg:w-24">
				{#if currentYearIndex < enabledYears.length - 1}
					<span class="text-xs text-gray-500 dark:text-neutral-500">
						{enabledYears[currentYearIndex + 1].label}
					</span>
				{/if}
			</div>
		</div>
	</div>

	{#if showOpacitySlider}
		<OpacitySlider bind:historicalMapOpacity />
	{/if}

	<div class="mt-4 flex items-center justify-center gap-1">
		{#each enabledYears as year, i}
			<div
				class="h-1 rounded-full transition-all duration-200 {i === currentYearIndex
					? 'w-6 bg-gray-800 dark:bg-neutral-200'
					: 'w-3 bg-gray-300 dark:bg-neutral-700'}"
				title={year.label}
			></div>
		{/each}
	</div>
</div>

{#if showSettings}
	<Settings
		bind:showHideMapButton
		bind:showSettings
		bind:showOpacitySlider
		bind:enabledYears
		bind:currentYearIndex
		{availableYears}
	/>
{/if}

<script lang="ts">
	export let enabledYears: { year: number; label: string }[];
	export let availableYears: { year: number; label: string }[];
	export let currentYearIndex: number;

	function toggleYear(year: { year: number; label: string }) {
		const currentYear = enabledYears[currentYearIndex];

		if (enabledYears.some((y) => y.year === year.year)) {
			// Don't allow disabling if only one year would remain
			if (enabledYears.length > 1) {
				enabledYears = enabledYears.filter((y) => y.year !== year.year);

				// If disabling a year before current year, decrement index
				if (year.year < currentYear.year) {
					currentYearIndex = Math.max(0, currentYearIndex - 1);
				}
			}
		} else {
			enabledYears = [...enabledYears, year].sort((a, b) => a.year - b.year);

			// If enabling a year before current year, increment index
			if (year.year < currentYear.year) {
				currentYearIndex = Math.min(currentYearIndex + 1, enabledYears.length - 1);
			}
		}
	}
</script>

<div class="mt-4 space-y-2">
	<div class="mb-1 flex items-center justify-between">
		<h3 class="text-sm font-medium text-gray-700 dark:text-neutral-300">Enabled years</h3>
		<span class="text-xs text-gray-500 dark:text-neutral-400">
			{enabledYears.length} enabled
		</span>
	</div>

	<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
		{#each availableYears as year}
			{#if year.year !== 2999}
				<button
					class="group relative flex h-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors {enabledYears.some(
						(y) => y.year === year.year
					)
						? 'bg-gray-700 text-white dark:bg-neutral-300 dark:text-neutral-800'
						: 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400'}"
					on:click={() => toggleYear(year)}
					disabled={enabledYears.length === 1 && enabledYears.some((y) => y.year === year.year)}
				>
					{year.label}
				</button>
			{/if}
		{/each}
	</div>
</div>

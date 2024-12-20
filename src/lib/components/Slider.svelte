<script lang="ts">
	export let currentYearIndex: number;
	export let showHistoricalMap: boolean;
	export let availableYears: { year: number; label: string }[];

	function handlePrevYear() {
		currentYearIndex = Math.max(0, currentYearIndex - 1);
	}

	function handleNextYear() {
		currentYearIndex = Math.min(availableYears.length - 1, currentYearIndex + 1);
	}
</script>

<div
	class="absolute bottom-2 left-1/2 z-10 min-w-[320px] max-w-[90vw] -translate-x-1/2 rounded-lg bg-white/95 p-3 shadow-md backdrop-blur-md sm:min-w-[280px] md:p-4 dark:bg-neutral-900/95"
>
	<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
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
						{availableYears[currentYearIndex - 1].label}
					</span>
				{/if}
			</div>
		</div>

		<div
			class="flex w-32 flex-col
		 items-center lg:w-36"
		>
			<div class="text-center text-xl font-semibold text-gray-900 md:text-lg dark:text-neutral-200">
				{availableYears[currentYearIndex].label}
			</div>
			<button
				class="mt-1 text-gray-600 dark:text-neutral-400"
				on:click={() => (showHistoricalMap = !showHistoricalMap)}
				aria-label={showHistoricalMap ? 'Hide historical map' : 'Show historical map'}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					{#if showHistoricalMap}
						<path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
						<path
							fill-rule="evenodd"
							d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
							clip-rule="evenodd"
						/>
					{:else}
						<path
							d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z"
						/>
						<path
							d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z"
						/>
						<path
							d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z"
						/>
					{/if}
				</svg>
			</button>
		</div>

		<div class="flex flex-col items-center">
			<button
				class="text-gray-600 hover:text-gray-900 disabled:opacity-50 dark:text-neutral-400 dark:hover:text-neutral-200"
				on:click={handleNextYear}
				disabled={currentYearIndex === availableYears.length - 1}
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
				{#if currentYearIndex < availableYears.length - 1}
					<span class="text-xs text-gray-500 dark:text-neutral-500">
						{availableYears[currentYearIndex + 1].label}
					</span>
				{/if}
			</div>
		</div>
	</div>

	<div class="mt-4 flex items-center justify-center gap-1">
		{#each availableYears as year, i}
			<div
				class="h-1 rounded-full transition-all duration-200 {i === currentYearIndex
					? 'w-6 bg-gray-800 dark:bg-neutral-200'
					: 'w-3 bg-gray-300 dark:bg-neutral-700'}"
				title={year.label}
			></div>
		{/each}
	</div>
</div>

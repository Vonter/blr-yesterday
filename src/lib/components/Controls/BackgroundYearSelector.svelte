<script lang="ts">
	export let backgroundYearIndex: number;
	export let availableYears: { year: number; label: string }[];

	let isDropdownOpen = false;

	function selectBackgroundYear(index: number) {
		backgroundYearIndex = index;
		isDropdownOpen = false;
	}

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	function handleOutsideClick(event: MouseEvent) {
		const dropdown = document.querySelector('.background-year-dropdown');
		if (dropdown && !dropdown.contains(event.target as Node) && isDropdownOpen) {
			isDropdownOpen = false;
		}
	}

	// Close dropdown on ESC key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isDropdownOpen) {
			isDropdownOpen = false;
		}
	}
</script>

<svelte:window on:click={handleOutsideClick} on:keydown={handleKeydown} />

<div class="mt-4 space-y-2">
	<div class="mb-1 flex items-center justify-between">
		<h3 class="text-sm font-medium text-gray-900 dark:text-neutral-200">Background map</h3>
	</div>

	<div class="background-year-dropdown relative">
		<button
			type="button"
			class="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white/95 px-3 py-2 text-sm shadow-sm transition-all duration-200 ease-in-out hover:border-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600 dark:focus:border-neutral-500 dark:focus:ring-neutral-500"
			on:click={toggleDropdown}
			aria-haspopup="listbox"
			aria-expanded={isDropdownOpen}
			aria-labelledby="background-year-label"
			id="background-year-button"
		>
			<span class="truncate">{availableYears[backgroundYearIndex].label}</span>
			<svg
				class="ml-2 h-5 w-5 transform transition-transform duration-200 ease-in-out {isDropdownOpen
					? 'rotate-180'
					: ''}"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>

		<div
			class="absolute z-10 mt-1 max-h-60 w-full origin-top overflow-hidden rounded-md bg-white/95 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out focus:outline-none dark:bg-neutral-800 dark:ring-neutral-700"
			role="listbox"
			aria-labelledby="background-year-label"
			tabindex="-1"
			style="opacity: {isDropdownOpen ? '1' : '0'}; transform: scale({isDropdownOpen
				? '1'
				: '0.95'}) translateY({isDropdownOpen ? '0' : '-10px'}); pointer-events: {isDropdownOpen
				? 'auto'
				: 'none'};"
		>
			<div class="grid max-h-48 gap-0.5 overflow-y-auto p-1.5">
				{#each availableYears as year, index}
					<button
						class="flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors duration-150 ease-in-out {backgroundYearIndex ===
						index
							? 'bg-gray-700 text-white dark:bg-neutral-600 dark:text-neutral-100'
							: 'text-gray-900 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700'}"
						role="option"
						aria-selected={backgroundYearIndex === index}
						on:click={() => selectBackgroundYear(index)}
					>
						{year.label}
						{#if backgroundYearIndex === index}
							<svg class="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>

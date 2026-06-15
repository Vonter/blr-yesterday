<script lang="ts">
	import TimelineYears from './TimelineYears.svelte';
	import BackgroundYearSelector from './BackgroundYearSelector.svelte';
	import type { YearOption } from '$lib/config';

	let {
		showSettings = $bindable(false),
		showHideMapButton = $bindable(false),
		showOpacitySlider = $bindable(),
		enabledYears = $bindable(),
		availableYears,
		currentYearIndex = $bindable(),
		backgroundYearIndex = $bindable()
	}: {
		showSettings?: boolean;
		showHideMapButton?: boolean;
		showOpacitySlider: boolean;
		enabledYears: YearOption[];
		availableYears: YearOption[];
		currentYearIndex: number;
		backgroundYearIndex: number;
	} = $props();

	function toggleSettings() {
		showSettings = !showSettings;
	}

	function handleOutsideClick(event: MouseEvent) {
		const modal = document.querySelector('.modal');
		if (modal && !modal.contains(event.target as Node)) {
			showSettings = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			showSettings = false;
		}
	}
</script>

{#snippet toggle(id: string, label: string, checked: boolean, onToggle: () => void)}
	<div class="flex items-center justify-between gap-4">
		<label class="text-sm font-medium text-gray-900 dark:text-neutral-200" for={id}>{label}</label>
		<button
			class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {checked
				? 'bg-gray-800 dark:bg-neutral-200'
				: 'bg-gray-200 dark:bg-neutral-700'}"
			onclick={onToggle}
			{id}
			role="switch"
			aria-checked={checked}
		>
			<span
				class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform dark:bg-neutral-900 {checked
					? 'translate-x-6'
					: 'translate-x-1'}"
			></span>
		</button>
	</div>
{/snippet}

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm"
	onclick={handleOutsideClick}
>
	<div
		class="modal relative max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur-md sm:max-w-md sm:p-6 md:max-w-lg lg:max-w-xl dark:bg-neutral-900/95"
	>
		<div class="sticky top-0 z-10 mb-4 flex items-center justify-between py-2 sm:mb-6">
			<h2 class="text-lg font-semibold text-gray-900 sm:text-xl dark:text-neutral-200">Settings</h2>
			<button
				class="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
				onclick={toggleSettings}
				aria-label="Close settings"
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

		<div class="space-y-6">
			{@render toggle(
				'hideMapToggle',
				'Background visibility toggle',
				showHideMapButton,
				() => (showHideMapButton = !showHideMapButton)
			)}
			{@render toggle(
				'opacitySliderToggle',
				'Background opacity slider',
				showOpacitySlider,
				() => (showOpacitySlider = !showOpacitySlider)
			)}

			<BackgroundYearSelector bind:backgroundYearIndex {availableYears} />

			<TimelineYears {availableYears} bind:enabledYears bind:currentYearIndex></TimelineYears>
		</div>
	</div>
</div>

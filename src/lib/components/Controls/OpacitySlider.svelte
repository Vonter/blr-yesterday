<script lang="ts">
	export let historicalMapOpacity = 1;
</script>

<div class="mt-4 flex items-center justify-center gap-3">
	<input
		type="range"
		min="0"
		max="1"
		step="0.01"
		bind:value={historicalMapOpacity}
		class="h-1.5 w-32 appearance-none rounded-lg bg-gray-300 accent-gray-800 dark:bg-neutral-700 dark:accent-neutral-200"
		aria-label="Map opacity"
	/>
</div>

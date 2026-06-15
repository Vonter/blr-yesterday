<script lang="ts">
	let { showPins = $bindable() }: { showPins: boolean } = $props();
</script>

<button
	class="rounded-full p-1 text-gray-600 md:hover:text-gray-900 dark:text-neutral-400 dark:md:hover:text-neutral-200"
	onclick={() => (showPins = !showPins)}
	aria-label={showPins ? 'Hide multimedia pins' : 'Show multimedia pins'}
	aria-pressed={showPins}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="currentColor"
	>
		{#if showPins}
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8Zm0 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
			/>
		{:else}
			<!-- Same filled pin as the on state (identical visual weight), with a gap cut along
			     the slash so the slash stays legible against the solid glyph. -->
			<mask id="pin-toggle-slash-gap">
				<rect width="24" height="24" fill="#fff" />
				<path d="M2.5 2.5 21.5 21.5" stroke="#000" stroke-width="3.5" stroke-linecap="round" />
			</mask>
			<path
				mask="url(#pin-toggle-slash-gap)"
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8Zm0 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
			/>
			<path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18Z" />
		{/if}
	</svg>
</button>

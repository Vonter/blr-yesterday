<script lang="ts">
	import Map from '../lib/components/Map.svelte';
	import About from '../lib/components/About.svelte';
	import SEO from '../lib/components/SEO.svelte';

	let showAboutDrawer = false;
</script>

<main data-vaul-drawer-wrapper>
	<SEO />
	<Map on:showAbout={() => (showAboutDrawer = true)} />
	<About bind:showAboutDrawer />
</main>

<style lang="postcss">
	/* Hide the default attribution */
	:global(.maplibregl-ctrl.maplibregl-ctrl-attrib) {
		display: none;
	}

	/* Dark mode */
	@media (prefers-color-scheme: dark) {
		:global(.maplibregl-ctrl) {
			background-color: rgb(24 24 27 / 0.95) !important;
		}

		:global(.maplibregl-ctrl button > span) {
			filter: invert(1);
		}
	}
</style>

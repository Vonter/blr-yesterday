<script lang="ts">
	import Map from '../lib/components/Map.svelte';
</script>

<Map />

<style>
	/* On mobile, hide the attribution */
	@media (max-width: 768px) {
		:global(.maplibregl-ctrl.maplibregl-ctrl-attrib) {
			display: none;
		}
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import { config } from '$lib/config';

	let {
		title = config.siteInfo.name,
		description = config.siteInfo.description,
		keywords = config.siteInfo.keywords,
		author = config.siteInfo.author,
		canonicalUrl = config.siteInfo.canonicalUrl,
		ogImage = config.siteInfo.ogImage,
		twitterHandle = null,
		twitterCardType = 'summary_large_image'
	}: {
		title?: string;
		description?: string;
		keywords?: string;
		author?: string;
		canonicalUrl?: string;
		ogImage?: string;
		twitterHandle?: string | null;
		twitterCardType?: 'summary' | 'summary_large_image';
	} = $props();

	let currentUrl = $state('');

	onMount(() => {
		currentUrl = window.location.href;
	});
</script>

<svelte:head>
	<!-- Basic Meta Tags -->
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<meta name="author" content={author} />
	<meta name="robots" content="index, follow" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalUrl || currentUrl} />

	<!-- Open Graph Tags -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content={canonicalUrl || currentUrl} />
	<meta property="og:type" content="website" />

	<!-- Twitter Card Tags -->
	<meta name="twitter:card" content={twitterCardType} />
	<meta name="twitter:site" content={twitterHandle} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	<!-- Additional Meta Tags -->
	<meta name="language" content="English" />
	<meta name="revisit-after" content="7 days" />
	<meta name="distribution" content="global" />
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />

	<!-- RSS URL -->
	<link rel="alternate" type="application/rss+xml" {title} href="/rss.xml" />
</svelte:head>

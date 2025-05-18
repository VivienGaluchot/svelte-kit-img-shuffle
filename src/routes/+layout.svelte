<script lang="ts">
	import { page } from '$app/stores';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>Picture slicer</title>
</svelte:head>

{@render children?.()}

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref($page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

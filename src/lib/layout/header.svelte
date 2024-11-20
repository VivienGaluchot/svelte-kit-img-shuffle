<script lang="ts">
	import * as paths from '$app/paths';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		title?: string;
	}

	let { children, title = 'Picture slicer' }: Props = $props();
</script>

<header>
	<div class="logo-bar">
		<img src="{paths.base}/favicon.png" alt="logo" />
		<h1>{title}</h1>
	</div>
	{@render children?.()}
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.logo-bar {
		min-height: 2.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
	}

	h1 {
		font-size: 1.2rem;
		margin: 0;
	}

	.logo-bar img {
		max-width: 1.5rem;
		max-height: 1.5rem;
		image-rendering: crisp-edges;
	}

	.logo-bar h1 {
		color: white;
		font-weight: 300;
	}
</style>

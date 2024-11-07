<script lang="ts">
	import * as paths from '$app/paths';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<header>
	<div class="logo-bar">
		<img src="{paths.base}/favicon.png" alt="logo" />
		<h1>Picture slicer</h1>
	</div>
	{@render children?.()}
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	h1 {
		font-size: 1.5rem;
		margin: 0;
	}

	.logo-bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
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

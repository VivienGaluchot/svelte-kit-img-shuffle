<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		maxWidth?: string;
		children?: Snippet;
	}

	let { maxWidth = 'unset', children }: Props = $props();
</script>

<div style="max-width: {maxWidth};">
	{@render children?.()}
</div>

<style>
	div {
		margin: auto;
		min-height: calc(100% - 2rem);
		width: calc(100% - 2rem);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;
	}
</style>

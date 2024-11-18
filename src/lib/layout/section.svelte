<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		// css gap between section elements
		gap?: string;
	}

	let { children, gap = '1rem' }: Props = $props();
</script>

<section style="gap: {gap};">
	{@render children?.()}
</section>

<style>
	section {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 0.5rem;
		padding: 1rem;
		display: flex;
		flex-direction: column;
	}
</style>

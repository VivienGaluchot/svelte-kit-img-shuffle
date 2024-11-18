<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div>
	{@render children?.()}
</div>

<style>
	div {
		justify-self: start;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>

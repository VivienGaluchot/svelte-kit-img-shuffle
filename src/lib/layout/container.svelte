<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		maxWidth?: string;
		children?: Snippet;
	}

	let { maxWidth = 'unset', children }: Props = $props();
</script>

<div class="container" style="max-width: {maxWidth};">
	{@render children?.()}
</div>

<style>
	.container {
		margin: auto;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;

		@media (max-width: 30rem) {
			padding: 0.5rem;
		}
	}
</style>

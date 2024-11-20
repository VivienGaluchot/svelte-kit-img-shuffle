<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="content">
	{@render children?.()}
</div>

<style>
	.content {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 0.5rem;
		justify-self: start;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-height: 5rem;
		padding: 1rem;

		@media (max-width: 30rem) {
			padding: 0.5rem;
		}
	}
</style>

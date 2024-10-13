<script lang="ts">
	export let maxWidth: string = 'unset';
</script>

<div style="max-width: {maxWidth};">
	<slot />
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

<script lang="ts">
	import * as paths from '$app/paths';
	import Section from '$lib/layout/section.svelte';
	import { images } from '$lib/image';

	function getUrl(imageIndex: number, tileCount: number) {
		return `${paths.base}/play?n=${tileCount}&i=${imageIndex}`;
	}
</script>

<svelte:head>
	<title>Picture slicer</title>
</svelte:head>

<Section>
	{#each images as image, index}
		<div class="flex-h row">
			<div class="flex-h g-sm">
				<div class="icon" style="background-color: {image.color};" />
				{image.name}
			</div>
			<div class="flex-h g-sm">
				<a class="button" href={getUrl(index, 25)}>Easy</a>
				<a class="button" href={getUrl(index, 50)}>Medium</a>
				<a class="button" href={getUrl(index, 100)}>Hard</a>
			</div>
		</div>
	{/each}
</Section>

<style>
	.row {
		background-color: rgba(255, 255, 255, 0.02);
		border-radius: 0.2rem;
		padding-left: 0.5rem;
	}

	.icon {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 1rem;
		background-color: wheat;
	}

	.flex-h {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}

	.flex-h {
		gap: 1rem;
	}

	.g-sm {
		gap: 0.5rem;
	}

	.button {
		border: none;
		font-weight: lighter;
	}

	.button:hover {
		cursor: pointer;
	}
</style>

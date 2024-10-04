<script lang="ts">
	import * as paths from '$app/paths';
	import { goto } from '$app/navigation';
	import Section from '$lib/layout/section.svelte';
	import { images } from '$lib/image';

	function play(imageIndex: number, tileCount: number) {
		goto(`${paths.base}/play?n=${tileCount}&i=${imageIndex}`);
	}
</script>

<svelte:head>
	<title>Picture slicer multi</title>
</svelte:head>

<Section>
	{#each images as image, index}
		<div class="flex-h row">
			<div class="flex-h g-sm">
				<div class="icon" style="background-color: {image.color};" />
				{image.name}
			</div>
			<div class="flex-h g-sm">
				<button on:click={() => play(index, 25)}>Easy</button>
				<button on:click={() => play(index, 50)}>Medium</button>
				<button on:click={() => play(index, 100)}>Hard</button>
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

	button {
		border: none;
		font-weight: lighter;
	}

	button:hover {
		cursor: pointer;
	}
</style>

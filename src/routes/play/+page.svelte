<script lang="ts">
	import { page } from '$app/stores';
	import Game from './game.svelte';
	import Section from '$lib/layout/section.svelte';
	import { type PuzzleImage, images } from '$lib/image';

	const tileCount: number = parseInt($page.url.searchParams.get('n') ?? '100');
	const imageId: number = parseInt($page.url.searchParams.get('i') ?? '0');
	const image: PuzzleImage = images[imageId];

	let game: Game;
	let showBorders: boolean;
</script>

<svelte:head>
	<title>Play - Picture slicer multi</title>
</svelte:head>

<Section>
	<Game bind:this={game} {showBorders} {tileCount} {image} />

	<div class="toolbar">
		<button on:click={() => game.shuffle()}>Shuffle</button>
		<div>
			<input id="boder-checkbox" type="checkbox" bind:checked={showBorders} />
			<label for="boder-checkbox">Show borders</label>
		</div>
	</div>
</Section>

<style>
	.toolbar {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
	}
</style>

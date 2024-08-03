<script lang="ts">
	import { page } from '$app/stores';
	import Game from './game.svelte';
	import Section from '$lib/layout/section.svelte';
	import { type PuzzleImage, images } from '$lib/image';

	const tileCount: number = parseInt($page.url.searchParams.get('n') ?? '100');
	const imageId: number = parseInt($page.url.searchParams.get('i') ?? '0');
	const image: PuzzleImage = images[imageId];

	let actionCount: number;
	let rows: number;
	let cols: number;
	let isSolved: boolean;

	let game: Game;
	let showBorders: boolean;
</script>

<svelte:head>
	<title>Play - Picture slicer multi</title>
</svelte:head>

<Section>
	<Game
		bind:this={game}
		bind:rows
		bind:cols
		bind:actionCount
		bind:isSolved
		{showBorders}
		{tileCount}
		{image}
	/>

	<div class="toolbar">
		<!-- <div>
			<input id="boder-checkbox" type="checkbox" bind:checked={showBorders} />
			<label for="boder-checkbox">Show borders</label>
		</div> -->
		<!-- <button on:click={() => game.shuffle()}>Shuffle</button> -->
		<div class="muted">
			{rows} x {cols}
		</div>
		{#if isSolved}
			<div>Solved ✨ <a href="/">Play again</a></div>
		{/if}
		<div class="muted">
			{actionCount} move{#if actionCount > 1}s{/if}
		</div>
	</div>
</Section>

<style>
	.muted {
		opacity: 0.7;
		font-weight: lighter;
	}
	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
	}
</style>

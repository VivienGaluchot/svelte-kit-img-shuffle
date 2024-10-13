<script lang="ts">
	import * as paths from '$app/paths';
	import { page } from '$app/stores';
	import * as im from '$lib/image';
	import Section from '$lib/layout/section.svelte';
	import Game from './game.svelte';

	function getImageFromUrl(): im.ImageResource | null {
		try {
			const param = $page.url.searchParams.get('i');
			if (!param) {
				throw new Error("missing 'i' url parameter");
			}
			const resource: im.ImageResource = JSON.parse(decodeURIComponent(param));
			// TODO validate `resource` ?
			return resource;
		} catch (err) {
			console.error('failed to parse url image', err);
		}
		return null;
	}

	const tileCount: number = parseInt($page.url.searchParams.get('n') ?? '100');
	const imageResource = getImageFromUrl() ?? im.staticImages[0]!;
	const imagePromise = im.toPuzzleImage(imageResource);

	let actionCount: number;
	let durationInSec: number;
	let rows: number;
	let cols: number;
	let isSolved: boolean;

	let game: Game;
	let showBorders: boolean;
</script>

<svelte:head>
	<title>Play - Picture slicer</title>
</svelte:head>

{#await imagePromise}
	Loading image...
{:then image}
	<Section>
		<Game
			bind:this={game}
			bind:rows
			bind:cols
			bind:actionCount
			bind:isSolved
			bind:durationInSec
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
				<div>Solved ✨ <a href={paths.base + '/'}>Play again</a></div>
			{/if}
			<div class="muted">
				{actionCount} move{#if actionCount > 1}s{/if} | {Math.floor(durationInSec / 60)
					.toString()
					.padStart(2, '0')}:{(durationInSec % 60).toString().padStart(2, '0')}
			</div>
		</div>
	</Section>
{:catch err}
	{console.error(err) ?? ''}
	Failed to load image
{/await}

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

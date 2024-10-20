<script lang="ts">
	import * as paths from '$app/paths';
	import { page } from '$app/stores';
	import * as im from '$lib/image';
	import * as gs from '$lib/gameSetting';
	import Container from '$lib/layout/container.svelte';
	import Content from '$lib/layout/content.svelte';
	import Footer from '$lib/layout/footer.svelte';
	import Header from '$lib/layout/header.svelte';
	import Section from '$lib/layout/section.svelte';
	import Game from './game.svelte';

	const gameSettings = gs.decodeGameSettingsFromUrl($page.url);
	const tileCount = gameSettings.tileCount;
	const seed = gameSettings.seed;
	const imageResource = gs.getImage(gameSettings);
	const imagePromise = im.toPuzzleImage(imageResource);

	let actionCount: number;
	let durationInSec: number;
	let rows: number;
	let cols: number;
	let isSolved: boolean;

	let showBorders: boolean;
</script>

<svelte:head>
	{#await imagePromise}
		<title>Picture slicer</title>
	{:then image}
		<title>{image.name} - Picture slicer</title>
	{/await}
</svelte:head>

<Container maxWidth="50rem">
	<Header>
		<div class="toolbar">
			{#await imagePromise then image}
				<div class="img-name">{image.name}</div>
			{/await}
			<div><a class="button" href={paths.base + '/'}>Back</a></div>
		</div>
	</Header>

	<Content>
		{#await imagePromise}
			<Section>Loading image...</Section>
		{:then image}
			<Section>
				<Game
					bind:rows
					bind:cols
					bind:actionCount
					bind:isSolved
					bind:durationInSec
					{tileCount}
					{seed}
					{image}
				/>

				<div class="toolbar">
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
		{:catch}
			<Section>Failed to load image...</Section>
		{/await}
	</Content>

	<Footer />
</Container>

<style>
	.img-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 30rem;
		direction: rtl;
	}

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

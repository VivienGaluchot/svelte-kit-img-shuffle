<script lang="ts">
	import { onMount } from 'svelte';
	import * as paths from '$app/paths';
	import { page } from '$app/stores';
	import * as im from '$lib/image';
	import * as gs from '$lib/gameSetting';
	import { idb } from '$lib/db';
	import Container from '$lib/layout/container.svelte';
	import Content from '$lib/layout/content.svelte';
	import Footer from '$lib/layout/footer.svelte';
	import Header from '$lib/layout/header.svelte';
	import Section from '$lib/layout/section.svelte';
	import Game from './game.svelte';
	import * as homeUrl from '../url';

	// settings
	// ---------------------------

	const gameSettings = gs.decodeGameSettingsFromUrl($page.url);
	const tileCount = gameSettings.tileCount;
	const seed = gameSettings.seed;
	const imageResource = gs.getImage(gameSettings.image);
	const imagePromise = imageResource.then(im.toPuzzleImage);

	let actionCount: number = $state(0);
	let rows: number = $state(0);
	let cols: number = $state(0);
	let isSolved: boolean = $state(false);

	// urls
	// ---------------------------

	let tab: homeUrl.Tab;
	switch (gameSettings.image.kind) {
		case 'static':
			tab = 'official';
			break;
		case 'custom':
			tab = 'custom';
			break;
	}
	const backUrl = homeUrl.get(tab, $page.url);

	// share
	// ---------------------------

	const isShareable = gameSettings.image.kind == 'static';

	let shareState: undefined | 'success' | 'failed' = $state();
	let resetTimeout: undefined | number;
	function waitAndReset() {
		if (resetTimeout) {
			clearTimeout(resetTimeout);
		}
		resetTimeout = setTimeout(() => {
			shareState = undefined;
		}, 1000);
	}

	function share() {
		navigator.clipboard.writeText($page.url.toString()).then(
			() => {
				shareState = 'success';
				waitAndReset();
			},
			() => {
				shareState = 'failed';
				waitAndReset();
			}
		);
	}

	// duration
	// ---------------------------

	let durationInSec = $state(0);

	const interval = setInterval(() => {
		if (!document.hidden) {
			durationInSec += 1;
		}
	}, 1000);

	onMount(() => {
		return () => {
			clearInterval(interval);
		};
	});

	// on solved
	// ---------------------------

	$effect(() => {
		if (isSolved) {
			clearInterval(interval);
			idb.gameCompletes.add({ settings: gameSettings, actionCount, durationInSec });
		}
	});
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
			<div class="img-name">
				{#await imageResource}
					...
				{:then imageResource}
					{imageResource.name}
				{/await}
			</div>
			{#if isShareable}
				<button
					class="share-btn"
					class:success={shareState == 'success'}
					class:failed={shareState == 'failed'}
					onclick={share}
				>
					Share link
					<i class="fa-solid fa-copy"></i>
				</button>
			{/if}
			<div>
				<a class="button" href={backUrl.toString()}>Back</a>
			</div>
		</div>
	</Header>

	<Content>
		{#await imagePromise}
			<Section>Loading image...</Section>
		{:then image}
			<Section>
				<Game bind:rows bind:cols bind:actionCount bind:isSolved {tileCount} {seed} {image} />

				<div class="toolbar">
					<div class="muted" style="flex:1;">
						{rows} x {cols}
					</div>
					<div>
						{#if isSolved}
							Solved ✨
						{/if}
					</div>
					<div class="muted" style="flex:1; text-align: right;">
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
		padding: 0.5rem;
	}

	.muted {
		opacity: 0.7;
		font-weight: lighter;
	}

	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.share-btn {
		transition: color 200ms ease-in-out;
	}

	.success {
		color: rgb(130, 248, 130);
		transition: unset;
	}

	.failed {
		color: rgb(248, 130, 130);
		transition: unset;
		animation: wiggle 0.1s;
	}

	@keyframes wiggle {
		0% {
			transform: rotate(0deg);
		}
		40% {
			transform: rotate(5deg);
		}
		80% {
			transform: rotate(-5deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}
</style>

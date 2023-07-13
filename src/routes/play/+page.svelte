<script lang="ts">
	import { page } from '$app/stores';
	import Game from './game.svelte';
	import Section from '$lib/layout/section.svelte';

	const tileCount: number = parseInt($page.url.searchParams.get('n') ?? '100');

	let game: Game;
	let showBorders: boolean;
</script>

<svelte:head>
	<title>Play - Picture slicer multi</title>
</svelte:head>

<Section>
	<Game bind:this={game} {showBorders} {tileCount} />

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
		margin-top: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import Game from './game.svelte';

	let game: Game;
	let showBorders: boolean;
</script>

<svelte:head>
	<title>Play - Picture slicer multi</title>
</svelte:head>

<Game bind:this={game} bind:showBorders />

<div class="toolbar">
	<button on:click={() => game.shuffle()}>Shuffle</button>
	<div>
		<input id="boder-checkbox" type="checkbox" bind:checked={showBorders} />
		<label for="boder-checkbox">Show borders</label>
	</div>
</div>

<style>
	.toolbar {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
	}
</style>

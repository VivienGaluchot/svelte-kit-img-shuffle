<script lang="ts">
	import { goto } from '$app/navigation';
	import Section from '$lib/layout/section.svelte';

	let tileCount: number;

	function play() {
		goto(`/play?n=${tileCount}`);
	}
</script>

<svelte:head>
	<title>Picture slicer multi</title>
</svelte:head>

<Section>
	<h2>New game</h2>

	<div class="flex-h">
		<div>
			<label for="tile-count-select">Level</label>
			<select id="tile-count-select" bind:value={tileCount}>
				<option value={50}>Easy</option>
				<option value={100}>Medium</option>
				<option value={250}>Hard</option>
			</select>
		</div>

		<div>
			<button on:click={play}>Play</button>
		</div>
	</div>
</Section>

<style>
	h2 {
		margin: 0;
	}

	.flex-h {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}
</style>

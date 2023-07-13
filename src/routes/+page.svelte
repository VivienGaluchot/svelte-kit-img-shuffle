<script lang="ts">
	import * as paths from '$app/paths';
	import { goto } from '$app/navigation';
	import Section from '$lib/layout/section.svelte';
	import { images } from '$lib/image';

	let imageIndex: number;
	let tileCount: number;

	function play() {
		goto(`${paths.base}/play?n=${tileCount}&i=${imageIndex}`);
	}
</script>

<svelte:head>
	<title>Picture slicer multi</title>
</svelte:head>

<Section>
	<h2>New game</h2>
	<div class="flex-h">
		<div class="flex-h">
			<div class="flex-h g-sm">
				<label for="image-select">Image</label>
				<select id="image-select" bind:value={imageIndex}>
					{#each images as image, index}
						<option value={index}>{image.name}</option>
					{/each}
				</select>
			</div>
			<div class="flex-h g-sm">
				<label for="tile-count-select">Level</label>
				<select id="tile-count-select" bind:value={tileCount}>
					<option value={25}>Easy</option>
					<option value={100}>Medium</option>
					<option value={250}>Hard</option>
				</select>
			</div>
		</div>
		<button on:click={play}>Play</button>
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
	}

	.flex-h {
		gap: 1rem;
	}

	.g-sm {
		gap: 0.5rem;
	}
</style>

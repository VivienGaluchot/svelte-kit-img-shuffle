<script lang="ts">
	import * as paths from '$app/paths';
	import * as gs from '$lib/gameSetting';
	import * as rd from '$lib/random';

	function getUrl(tileCount: number, image: gs.ImageSettings) {
		const url = new URL(`${paths.base}/play`, window.location.origin);
		gs.encodeSettingToUrl(url, { tileCount, seed: rd.getRandomString(Math.random, 6), ...image });
		return url.toString();
	}

	export let image: gs.ImageSettings;
	export let onDelete: ((image: gs.ImageSettings) => Promise<void>) | undefined = undefined;
</script>

<div class="flex-h">
	<div class="flex-h row">
		<div class="flex-h g-sm">
			{#await gs.getImage(image) then image}
				<div class="icon">
					<div class="icon-bg" style="background-image: url({image.url});" />
				</div>
				<div class="img-name">{image.name}</div>
			{/await}
		</div>
		<div class="flex-h g-sm">
			<a class="button" href={getUrl(40, image)}>Easy</a>
			<a class="button" href={getUrl(80, image)}>Medium</a>
			<a class="button" href={getUrl(120, image)}>Hard</a>
		</div>
	</div>
	{#if onDelete}
		<button class="button" on:click={() => onDelete(image)}><i class="fa-solid fa-trash" /></button>
	{/if}
</div>

<style>
	.row {
		background-color: rgba(255, 255, 255, 0.02);
		border-radius: 0.2rem;
		padding-left: 0.5rem;
		flex-grow: 1;
	}

	.flex-h {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 0 1rem;
	}

	.g-sm {
		gap: 0 0.5rem;
	}

	.icon {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 1rem;
		overflow: hidden;
	}

	.icon-bg {
		width: 150%;
		height: 150%;
		position: relative;
		top: -25%;
		left: -25%;
		border-radius: 1rem;
		background-color: #fff5;
		background-size: cover;
		filter: blur(0.2rem) saturate(1.5);
	}

	.img-name {
		padding: 0.5rem 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 10rem;
		direction: rtl;
	}
</style>

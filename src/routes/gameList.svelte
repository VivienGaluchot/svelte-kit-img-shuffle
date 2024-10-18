<script lang="ts">
	import * as paths from '$app/paths';
	import * as gs from '$lib/gameSetting';
	import * as rd from '$lib/random';

	function getUrl(tileCount: number, image: gs.ImageSettings) {
		const url = new URL(`${paths.base}/play`, window.location.origin);
		gs.encodeSettingToUrl(url, { tileCount, seed: rd.getRandomString(Math.random, 6), ...image });
		return url.toString();
	}

	export let images: gs.ImageSettings[];
</script>

{#each images as imageSetting}
	<div class="flex-h row">
		<div class="flex-h g-sm">
			<div class="icon" style="background-image: url({gs.getImage(imageSetting).url});" />
			<div class="img-name">{gs.getImage(imageSetting).name}</div>
		</div>
		<div class="flex-h g-sm">
			<a class="button" href={getUrl(40, imageSetting)}>Easy</a>
			<a class="button" href={getUrl(80, imageSetting)}>Medium</a>
			<a class="button" href={getUrl(120, imageSetting)}>Hard</a>
		</div>
	</div>
{/each}

<style>
	.row {
		background-color: rgba(255, 255, 255, 0.02);
		border-radius: 0.2rem;
		padding-left: 0.5rem;
	}

	.flex-h {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}

	.flex-h {
		gap: 0 1rem;
	}

	.g-sm {
		gap: 0 0.5rem;
	}

	.icon {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 1rem;
		background-color: #fff5;
		background-size: cover;
		border: 1px solid white;
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

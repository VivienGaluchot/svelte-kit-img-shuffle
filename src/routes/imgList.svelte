<script lang="ts">
	import * as paths from '$app/paths';
	import * as im from '$lib/image';

	function getUrl(tileCount: number, image: im.ImageResource) {
		let url = new URL(`${paths.base}/play`, window.location.origin);
		url.searchParams.set('n', `${tileCount}`);
		url.searchParams.set('i', `${encodeURIComponent(JSON.stringify(image))}`);
		return url.toString();
	}

	export let images: im.ImageResource[];
</script>

{#each images as image}
	<div class="flex-h row">
		<div class="flex-h g-sm dropzone">
			<div class="icon" style="background-image: url({image.url});" />
			<div class="img-name">{image.name}</div>
		</div>
		<div class="flex-h g-sm">
			<a class="button" href={getUrl(25, image)}>Easy</a>
			<a class="button" href={getUrl(50, image)}>Medium</a>
			<a class="button" href={getUrl(100, image)}>Hard</a>
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

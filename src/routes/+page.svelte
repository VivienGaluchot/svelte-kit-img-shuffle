<script lang="ts">
	import * as paths from '$app/paths';
	import Section from '$lib/layout/section.svelte';
	import * as im from '$lib/image';

	function getUrl(tileCount: number, image: im.ImageResource) {
		let url = new URL(`${paths.base}/play`, window.location.origin);
		url.searchParams.set('n', `${tileCount}`);
		url.searchParams.set('i', `${encodeURIComponent(JSON.stringify(image))}`);
		return url.toString();
	}

	let customImages: im.ImageResource[] = [];

	let fileInput: HTMLInputElement;
	let fileInputValue: FileList | null = null;
	$: if (fileInputValue) {
		const file = fileInputValue[0];
		if (file) {
			// TODO append when persistent
			customImages = [
				{
					name: file.name,
					url: URL.createObjectURL(file)
				}
			];
		}
	}
</script>

<svelte:head>
	<title>Picture slicer</title>
</svelte:head>

<Section>
	Choose an image
	{#each im.staticImages as image}
		<div class="flex-h row">
			<div class="flex-h g-sm dropzone">
				<div class="icon" style="background-image: url({image.url});" />
				<div class="img_name">{image.name}</div>
			</div>
			<div class="flex-h g-sm">
				<a class="button" href={getUrl(25, image)}>Easy</a>
				<a class="button" href={getUrl(50, image)}>Medium</a>
				<a class="button" href={getUrl(100, image)}>Hard</a>
			</div>
		</div>
	{/each}
</Section>
<Section>
	<div class="flex-h">
		<div>Play with custom image</div>
		<div>
			<button class="button" on:click={() => fileInput.click()}>+</button>
			<input
				bind:this={fileInput}
				hidden
				type="file"
				accept="image/*"
				bind:files={fileInputValue}
			/>
		</div>
	</div>
	{#each customImages as image}
		<div class="flex-h row">
			<div class="flex-h g-sm dropzone">
				<div class="icon" style="background-image: url({image.url});" />
				<div class="img_name">{image.name}</div>
			</div>
			<div class="flex-h g-sm">
				<a class="button" href={getUrl(25, image)}>Easy</a>
				<a class="button" href={getUrl(50, image)}>Medium</a>
				<a class="button" href={getUrl(100, image)}>Hard</a>
			</div>
		</div>
	{/each}
</Section>

<style>
	.row {
		background-color: rgba(255, 255, 255, 0.02);
		border-radius: 0.2rem;
		padding-left: 0.5rem;
	}

	.icon {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 1rem;
		background-color: #fff5;
		background-size: cover;
		border: 1px solid white;
	}

	.img_name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 10rem;
		direction: rtl;
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

	.button {
		border: none;
		font-weight: lighter;
	}

	.button:hover {
		cursor: pointer;
	}
</style>

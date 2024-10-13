<script lang="ts">
	import * as paths from '$app/paths';
	import Section from '$lib/layout/section.svelte';
	import * as im from '$lib/image';
	import ImgList from './imgList.svelte';

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
	<ImgList images={im.staticImages} />
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
	<ImgList images={customImages} />
</Section>

<style>
	.flex-h {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}

	.flex-h {
		gap: 1rem;
	}
</style>

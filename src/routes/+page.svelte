<script lang="ts">
	import * as paths from '$app/paths';
	import Section from '$lib/layout/section.svelte';
	import * as im from '$lib/image';
	import ImgList from './imgList.svelte';
	import Header from '$lib/layout/header.svelte';
	import Footer from '$lib/layout/footer.svelte';
	import Container from '$lib/layout/container.svelte';
	import Content from '$lib/layout/content.svelte';

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

<Container maxWidth="35rem">
	<Header />
	<Content>
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
	</Content>
	<Footer />
</Container>

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

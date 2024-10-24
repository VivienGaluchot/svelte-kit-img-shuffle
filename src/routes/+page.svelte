<script lang="ts">
	import Section from '$lib/layout/section.svelte';
	import * as im from '$lib/image';
	import * as gs from '$lib/gameSetting';
	import GameList from './gameList.svelte';
	import Header from '$lib/layout/header.svelte';
	import Footer from '$lib/layout/footer.svelte';
	import Container from '$lib/layout/container.svelte';
	import Content from '$lib/layout/content.svelte';

	let customImages: gs.ImageSettings[] = [];

	const staticImageSettings: gs.ImageSettings[] = [];
	for (const key of Object.keys(im.staticImages)) {
		staticImageSettings.push({ kind: 'static', key });
	}

	let fileInput: HTMLInputElement;
	let fileInputValue: FileList | null = null;
	$: if (fileInputValue) {
		const file = fileInputValue[0];
		if (file) {
			// TODO append when persistent
			customImages = [
				{
					kind: 'custom',
					image: {
						name: file.name,
						url: URL.createObjectURL(file)
					}
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
			<GameList images={staticImageSettings} />
		</Section>

		<Section>
			<div class="flex-h">
				<div>Custom images</div>
				<div>
					<button class="button" on:click={() => fileInput.click()}>
						<i class="fa-solid fa-arrow-up-from-bracket" />
					</button>
					<input
						bind:this={fileInput}
						hidden
						type="file"
						accept="image/*"
						bind:files={fileInputValue}
					/>
				</div>
			</div>
			<GameList images={customImages} />
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

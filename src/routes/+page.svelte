<script lang="ts">
	import { liveQuery } from 'dexie';
	import * as im from '$lib/image';
	import * as gs from '$lib/gameSetting';
	import { db } from '$lib/db';
	import GameRow from './gameRow.svelte';
	import Header from '$lib/layout/header.svelte';
	import Footer from '$lib/layout/footer.svelte';
	import Container from '$lib/layout/container.svelte';
	import Content from '$lib/layout/content.svelte';
	import Section from '$lib/layout/section.svelte';

	const staticImageSettings: gs.ImageSettings[] = [];
	for (const key of Object.keys(im.staticImages)) {
		staticImageSettings.push({ kind: 'static', key });
	}

	$: customImages = liveQuery(async () => {
		console.log('liveQuery');
		const customImages: gs.ImageSettings[] = [];
		try {
			// TODO: optimize by not making more db request in `GameRow` ?
			for (const image of await db.customImages.toArray()) {
				customImages.push({
					kind: 'custom',
					id: image.id
				});
			}
		} catch (err) {
			console.error('operation failed', err);
		}
		return customImages;
	});

	let fileInput: HTMLInputElement;
	let fileInputValue: FileList | null = null;
	$: if (fileInputValue) {
		const file = fileInputValue[0];
		if (file) {
			add(file.name, file);
		}
	}

	async function add(name: string, blob: Blob) {
		await db.customImages.add({ name, blob });
	}

	async function onDelete(image: gs.ImageSettings): Promise<void> {
		if (image.kind == 'custom') {
			await db.customImages.delete(image.id);
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
			{#each staticImageSettings as image (image)}
				<GameRow {image} />
			{/each}
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
			{#if $customImages}
				{#each $customImages as image (image)}
					<GameRow {image} {onDelete} />
				{/each}
			{/if}
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

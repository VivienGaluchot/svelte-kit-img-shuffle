<script lang="ts">
	import { liveQuery } from 'dexie';
	import * as im from '$lib/image';
	import * as gs from '$lib/gameSetting';
	import { db } from '$lib/db';
	import GameCard from './gameCard.svelte';
	import Header from '$lib/layout/header.svelte';
	import Footer from '$lib/layout/footer.svelte';
	import Container from '$lib/layout/container.svelte';
	import Content from '$lib/layout/content.svelte';
	import Section from '$lib/layout/section.svelte';
	import Game from './play/game.svelte';

	let tileCount: number;

	// static images

	const staticImageSettings: gs.StaticImageSetting[] = [];
	for (const key of Object.keys(im.staticImages)) {
		staticImageSettings.push({ kind: 'static', key });
	}

	// custom images

	$: customImages = liveQuery(async () => {
		const customImages: gs.CustomImageSetting[] = [];
		try {
			const keys = await db.customImages.toCollection().reverse().primaryKeys();
			for (const key of keys) {
				customImages.push({ kind: 'custom', id: key });
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
</script>

<svelte:head>
	<title>Picture slicer</title>
</svelte:head>

<Container maxWidth="35rem">
	<Header>
		<div class="flex-h">
			Difficulty
			<select bind:value={tileCount}>
				<option value={40}>Easy</option>
				<option value={80}>Medium</option>
				<option value={120}>Hard</option>
			</select>
		</div>
	</Header>
	<Content>
		<Section>
			Game images
			<div class="grid">
				{#each staticImageSettings as image (image.key)}
					<GameCard {image} {tileCount} />
				{/each}
			</div>
		</Section>

		<Section>
			<div class="flex-h">
				<div>Private images</div>
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
			{#if $customImages && $customImages.length > 0}
				<div class="grid">
					{#each $customImages as image (image.id)}
						<!-- TODO: delete via image menu -->
						<GameCard {image} {tileCount} />
					{/each}
				</div>
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
		gap: 1rem;
	}

	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
		gap: 1rem;
	}
</style>

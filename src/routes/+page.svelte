<script lang="ts">
	import { liveQuery } from 'dexie';
	import * as im from '$lib/image';
	import * as gs from '$lib/gameSetting';
	import * as db from '$lib/db';
	import GameCard from './gameCard.svelte';
	import Header from '$lib/layout/header.svelte';
	import Footer from '$lib/layout/footer.svelte';
	import Container from '$lib/layout/container.svelte';
	import Content from '$lib/layout/content.svelte';
	import Section from '$lib/layout/section.svelte';

	// difficulty

	let initialDifficulty = db.ldb.getDifficulty();
	let difficulty: db.Difficulty;

	$: db.ldb.setDifficulty(difficulty);
	let tileCount: number;

	$: switch (difficulty) {
		case 'easy':
			tileCount = 40;
			break;
		case 'medium':
			tileCount = 80;
			break;
		case 'hard':
			tileCount = 120;
			break;
	}

	// static images

	const staticImageSettings: gs.StaticImageSetting[] = [];
	for (const key of Object.keys(im.staticImages)) {
		staticImageSettings.push({ kind: 'static', key });
	}

	// custom images

	$: customImages = liveQuery(async () => {
		const customImages: gs.CustomImageSetting[] = [];
		try {
			const keys = await db.idb.customImages.toCollection().reverse().primaryKeys();
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
		await db.idb.customImages.add({ name, blob });
	}
</script>

<svelte:head>
	<title>Picture slicer</title>
</svelte:head>

<Container maxWidth="40rem">
	<Header>
		<div class="flex-h">
			Difficulty
			<select bind:value={difficulty}>
				<option value={'easy'} selected={initialDifficulty == 'easy'}>Easy</option>
				<option value={'medium'} selected={initialDifficulty == 'medium'}>Medium</option>
				<option value={'hard'} selected={initialDifficulty == 'hard'}>Hard</option>
			</select>
		</div>
	</Header>
	<Content>
		<Section>
			Official images
			<div class="grid">
				{#each staticImageSettings as image (image.key)}
					<GameCard {image} {tileCount} />
				{/each}
			</div>
		</Section>

		<Section>
			<div class="flex-h">
				<div>Custom images</div>
				<div>
					<button on:click={() => fileInput.click()}>
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
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: 1rem;
	}
</style>

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
	// ---------------------------

	function getTileCount(difficulty: db.Difficulty): number {
		switch (difficulty) {
			case 'easy':
				return 40;
			case 'medium':
				return 80;
			case 'hard':
				return 120;
			case 'super-hard':
				return 240;
		}
	}

	let difficulty: db.Difficulty = $state(db.ldb.getDifficulty());

	let tileCount: number = $derived(getTileCount(difficulty));

	$effect(() => {
		db.ldb.setDifficulty(difficulty);
	});

	// static images
	// ---------------------------

	const staticImageSettings: gs.StaticImageSetting[] = [];
	for (const key of Object.keys(im.staticImages)) {
		staticImageSettings.push({ kind: 'static', key });
	}

	let fileInput: HTMLInputElement;
	let fileInputValue: FileList | null = $state(null);

	// Unlock super hard when all the static images have been completed in hard mode
	let isSuperHardUnlocked = liveQuery(async () => {
		try {
			let keys = await db.idb.gameCompletes
				.orderBy('settings.image.key')
				.filter((x) => {
					return x.settings.tileCount == getTileCount('hard');
				})
				.uniqueKeys();
			return keys.length == Object.keys(im.staticImages).length;
		} catch (err) {
			console.error('operation failed', err);
		}
		return false;
	});

	// custom images
	// ---------------------------

	let customImages = liveQuery(async () => {
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

	async function add(name: string, blob: Blob) {
		await db.idb.customImages.add({ name, blob });
	}

	$effect(() => {
		if (fileInputValue) {
			const file = fileInputValue[0];
			if (file) {
				add(file.name, file);
			}
		}
	});
</script>

<svelte:head>
	<title>Picture slicer</title>
</svelte:head>

<Container maxWidth="60rem">
	<Header>
		<div class="flex-h">
			Difficulty
			<select bind:value={difficulty}>
				<option value={'easy'} selected={difficulty == 'easy'}>Easy</option>
				<option value={'medium'} selected={difficulty == 'medium'}>Medium</option>
				<option value={'hard'} selected={difficulty == 'hard'}>Hard</option>
				{#if $isSuperHardUnlocked || difficulty == 'super-hard'}
					<option value={'super-hard'} selected={difficulty == 'super-hard'}>Super Hard</option>
				{/if}
			</select>
		</div>
	</Header>
	<Content>
		<Section>
			<h2>Official images</h2>
			<div class="grid">
				{#each staticImageSettings as image (image.key)}
					<GameCard {image} {tileCount} />
				{/each}
			</div>
		</Section>

		<Section>
			<div class="flex-h">
				<h2>Custom images</h2>
				<div>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button onclick={() => fileInput.click()}>
						<i class="fa-solid fa-arrow-up-from-bracket"></i>
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

	h2 {
		font-size: 1.1rem;
		font-weight: lighter;
		padding: 0;
		margin: 0;
	}
</style>

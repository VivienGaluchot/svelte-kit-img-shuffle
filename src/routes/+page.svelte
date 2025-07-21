<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { setLocale, getLocale, type Locale, locales } from '$lib//paraglide/runtime.js';
	import { page } from '$app/stores';
	import { liveQuery } from 'dexie';
	import * as im from '$lib/image';
	import * as gs from '$lib/gameSetting';
	import * as db from '$lib/db';
	import Header from '$lib/layout/header.svelte';
	import Footer from '$lib/layout/footer.svelte';
	import Container from '$lib/layout/container.svelte';
	import Content from '$lib/layout/content.svelte';
	import GameCard from './gameCard.svelte';
	import * as homeUrl from './url';

	// urls
	// ---------------------------

	const tab: 'official' | 'custom' = $derived.by(() => {
		const t = $page.url.searchParams.get('t');
		switch (t) {
			case 'custom':
				return 'custom';
			default:
				return 'official';
		}
	});

	const officialUrl = homeUrl.get('official', $page.url);
	const customUrl = homeUrl.get('custom', $page.url);

	// locale
	// ---------------------------

	let locale: Locale = $state(getLocale());

	const localeFullName: Record<Locale, String> = {
		en: 'English',
		fr: 'Français'
	};

	$effect(() => {
		setLocale(locale);
	});

	// difficulty
	// ---------------------------

	let difficulty: db.Difficulty = $state(db.ldb.getDifficulty());

	const tileCount: number = $derived(gs.getTileCount(difficulty));

	$effect(() => {
		db.ldb.setDifficulty(difficulty);
	});

	// static images
	// ---------------------------

	const staticImageSettings: gs.StaticImageSetting[] = [];
	for (const key of Object.keys(im.staticImages)) {
		staticImageSettings.push({ kind: 'static', key });
	}

	let fileInput: HTMLInputElement | null = $state(null);
	let fileInputValue: FileList | null = $state(null);

	// Unlock super hard when all the static images have been completed in hard mode
	let isSuperHardUnlocked = liveQuery(async () => {
		try {
			let keys = new Set(
				await db.idb.gameCompletes
					.orderBy('settings.image.key')
					.filter((x) => {
						return x.settings.tileCount == gs.getTileCount('hard');
					})
					.uniqueKeys()
			);
			for (const key of Object.keys(im.staticImages)) {
				if (!keys.has(key)) {
					return false;
				}
			}
			return true;
		} catch (err) {
			console.error('operation failed', err);
		}
		return false;
	});

	$effect(() => {
		if ($isSuperHardUnlocked) {
			db.ldb.setSuperHardUnlocked(true);
		}
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
			<i class="fa-solid fa-gears"></i>
			<select bind:value={locale}>
				{#each locales as loc}
					<option value={loc}>{localeFullName[loc]}</option>
				{/each}
			</select>
			<select bind:value={difficulty}>
				<option value={'easy'} selected={difficulty == 'easy'}
					>{m.these_royal_hedgehog_grace()}</option
				>
				<option value={'medium'} selected={difficulty == 'medium'}
					>{m.lofty_bright_anaconda_swim()}</option
				>
				<option value={'hard'} selected={difficulty == 'hard'}>{m.clear_lost_ant_yell()}</option>
				{#if $isSuperHardUnlocked || difficulty == 'super-hard'}
					<option value={'super-hard'} selected={difficulty == 'super-hard'}
						>{m.large_stout_raven_flow()}</option
					>
				{/if}
			</select>
		</div>
	</Header>

	<Content>
		<div class="nav">
			<ul class="activatable">
				<li>
					<a href={officialUrl.toString()} class="button" class:active={tab == 'official'}
						>{m.game_light_capybara_pride()}</a
					>
				</li>
				<li>
					<a href={customUrl.toString()} class="button" class:active={tab == 'custom'}
						>{m.merry_heavy_wasp_startle()}</a
					>
				</li>
			</ul>
			{#if tab == 'custom'}
				<ul>
					<li>
						<button onclick={() => fileInput?.click()} aria-label="add image">
							<i class="fa-solid fa-arrow-up-from-bracket"></i>
						</button>
						<input
							bind:this={fileInput}
							hidden
							type="file"
							accept="image/*"
							bind:files={fileInputValue}
						/>
					</li>
				</ul>
			{/if}
		</div>

		<div class="grid">
			{#if tab == 'official'}
				{#each staticImageSettings as image (image.key)}
					<GameCard {image} {tileCount} />
				{/each}
			{:else if tab == 'custom'}
				{#if $customImages && $customImages.length > 0}
					{#each $customImages as image (image.id)}
						<GameCard {image} {tileCount} />
					{/each}
				{/if}
			{/if}
		</div>
	</Content>

	<Footer />
</Container>

<style>
	.flex-h {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.grid {
		flex-shrink: 1;
		overflow: auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		grid-auto-rows: min-content;
		gap: 1rem;
		border-radius: 0.5rem;
	}

	.nav {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.nav ul {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.nav li {
		margin: 0;
	}

	.nav a {
		font-size: 1.1rem;
		font-weight: lighter;
	}

	.activatable a:not(.active):not(:hover) {
		background-color: transparent;
	}
</style>

<script lang="ts">
	import * as paths from '$app/paths';
	import Confirm from '$lib/cmp/confirm.svelte';
	import * as db from '$lib/db';
	import * as gs from '$lib/gameSetting';
	import * as rd from '$lib/random';
	import { liveQuery } from 'dexie';

	interface Props {
		image: gs.ImageSetting;
		tileCount: number;
	}

	let { image, tileCount }: Props = $props();

	function getUrl(tileCount: number) {
		const url = new URL(`${paths.base}/play`, window.location.origin);
		gs.encodeSettingToUrl(url, { tileCount, seed: rd.getRandomString(Math.random, 6), image });
		return url.toString();
	}

	function equalImageTileCount(image: gs.ImageSetting, tileCount: number) {
		switch (image.kind) {
			case 'static':
				return {
					'settings.image.kind': image.kind,
					'settings.image.key': image.key,
					'settings.tileCount': tileCount
				};
			case 'custom':
				return {
					'settings.image.kind': image.kind,
					'settings.image.id': image.id,
					'settings.tileCount': tileCount
				};
		}
	}

	let isComplete = $derived.by(() => {
		// noop for reactivity
		// see https://github.com/dexie/Dexie.js/issues/2075
		tileCount;
		image;
		return liveQuery(async () => {
			try {
				const collection = db.idb.gameCompletes
					.where(equalImageTileCount(image, tileCount))
					.limit(1);
				return (await collection.count()) > 0;
			} catch (err) {
				console.error('operation failed', err);
			}
			return false;
		});
	});

	// delete
	// ---------------------------

	let delConfirm: Confirm;

	const isCustom = image.kind == 'custom';

	async function deleteImage(): Promise<void> {
		if (image.kind == 'custom') {
			if (await delConfirm.ask()) {
				// TODO also delete related gameCompletes entries
				await db.idb.customImages.delete(image.id);
			}
		}
	}
</script>

<Confirm bind:this={delConfirm}>
	Please confirm custom image deletion.<br />
	Operation cannot be undone.
</Confirm>

<div class="box">
	<a class="card" class:complete={$isComplete === true} href={getUrl(tileCount)}>
		{#await gs.getImage(image) then image}
			<div class="preview">
				<div class="preview-bg" style="background-image: url({image.url});"></div>
			</div>
			<div class="bar">
				<div class="name">{image.name}</div>
				<div class="tag">
					{#if $isComplete === true}
						<i class="fa-solid fa-circle-check"></i>
					{/if}
				</div>
			</div>
		{/await}
	</a>
	{#if isCustom}
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button class="del-btn" onclick={deleteImage}><i class="fa-solid fa-trash"></i></button>
	{/if}
</div>

<style>
	.card {
		position: relative;
		text-decoration: none;
		padding: 0;
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		transition: 100ms;
		outline: 0.3rem solid transparent;
		overflow: hidden;
	}

	.card:hover {
		background-color: rgba(255, 255, 255, 0.1);
		outline: 0.3rem solid rgba(255, 255, 255, 0.1);
	}

	.card:active {
		background-color: rgba(255, 255, 255, 0.1);
		outline: 0.4rem solid rgba(255, 255, 255, 0.1);
	}

	.bar {
		position: absolute;
		background-color: rgba(125, 125, 125, 0.2);
		backdrop-filter: blur(0.2rem);
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0.5rem;
		display: flex;
		justify-content: space-between;
		flex-shrink: 1;
		max-width: 100%;
		gap: 1rem;
		overflow: hidden;
		transition: 100ms;
	}

	.card:hover .bar {
		bottom: -3rem;
	}

	.preview {
		width: 100%;
		aspect-ratio: 0.8;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.preview-bg {
		width: 150%;
		height: 150%;
		position: relative;
		top: -25%;
		left: -25%;
		background-color: #fff5;
		background-size: cover;
		filter: blur(0.5rem) saturate(0.8);
		transition: 100ms;
	}

	.complete .preview-bg {
		filter: none;
	}

	.name {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		direction: rtl;
	}

	.box {
		position: relative;
	}

	.del-btn {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1;
		visibility: hidden;
		border-radius: 0.5rem;
		color: rgb(255, 76, 76);
	}

	.box:hover .del-btn {
		visibility: visible;
	}
</style>

<script lang="ts">
	import * as paths from '$app/paths';
	import Confirm from '$lib/cmp/confirm.svelte';
	import Timer from '$lib/cmp/timer.svelte';
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

	let bestDurationInSec = $derived.by(() => {
		// noop for reactivity
		// see https://github.com/dexie/Dexie.js/issues/2075
		tileCount;
		image;
		return liveQuery(async () => {
			try {
				const collection = await db.idb.gameCompletes
					.where(equalImageTileCount(image, tileCount))
					.sortBy('durationInSec');
				return collection[0]?.durationInSec;
			} catch (err) {
				console.error('operation failed', err);
			}
			return undefined;
		});
	});

	let isComplete = $derived($bestDurationInSec != undefined);

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

<div class="card">
	{#await gs.getImage(image) then image}
		<a
			class="link"
			class:complete={isComplete === true}
			href={getUrl(tileCount)}
			aria-label={image.name}
		>
			<div class="preview">
				<div class="preview-bg" style="background-image: url({image.url});"></div>
			</div>
		</a>
		{#if isCustom}
			<div class="top-bar">
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button class="del-btn" onclick={deleteImage}><i class="fa-solid fa-trash"></i></button>
			</div>
		{/if}
		<div class="bottom-bar flex-v">
			<div class="flex-h">
				<div class="name">{image.name}</div>
				{#if isComplete === true}
					<div class="tag">
						<i class="fa-solid fa-circle-check"></i>
					</div>
				{/if}
			</div>
			{#if $bestDurationInSec}
				<div class="flex-h">
					<div>Best</div>
					<div><Timer durationInSec={$bestDurationInSec}></Timer></div>
				</div>
			{/if}
		</div>
	{/await}
</div>

<style>
	.card {
		position: relative;
		overflow: hidden;
		outline: 0.3rem solid transparent;
		border-radius: 0.5rem;
	}

	.link {
		text-decoration: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		transition: 100ms;
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

	.bottom-bar,
	.del-btn {
		position: absolute;
		background-color: rgba(100, 100, 100, 0.2);
		backdrop-filter: blur(0.4rem);
	}

	.bottom-bar {
		padding: 0.5rem;
		flex-shrink: 1;
		max-width: 100%;
		transition: 100ms;
		left: 0;
		right: 0;
		bottom: 0;
		visibility: visible;
		font-weight: 100;
	}

	.flex-v {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.flex-h {
		display: flex;
		justify-content: space-between;
		gap: 0.8rem;
	}

	.card:hover .bottom-bar {
		bottom: -3rem;
		visibility: hidden;
	}

	.complete .preview-bg {
		filter: none;
	}

	.name {
		font-weight: 400;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		direction: rtl;
	}

	.del-btn {
		top: -2rem;
		visibility: hidden;
		right: 0.2rem;
		z-index: 1;
		border-radius: 0.5rem;
		color: rgb(255, 76, 76);
		transition: 100ms;
		text-align: center;
	}

	.card:hover .del-btn {
		top: 0.2rem;
		visibility: visible;
	}
</style>

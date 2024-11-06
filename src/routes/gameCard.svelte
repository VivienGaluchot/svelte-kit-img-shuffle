<script lang="ts">
	import * as paths from '$app/paths';
	import Confirm from '$lib/cmp/confirm.svelte';
	import { idb } from '$lib/db';
	import * as gs from '$lib/gameSetting';
	import * as rd from '$lib/random';
	import { liveQuery } from 'dexie';

	export let image: gs.ImageSetting;
	export let tileCount: number;

	function getUrl(tileCount: number) {
		const url = new URL(`${paths.base}/play`, window.location.origin);
		gs.encodeSettingToUrl(url, { tileCount, seed: rd.getRandomString(Math.random, 6), image });
		return url.toString();
	}

	$: isComplete = liveQuery(async () => {
		try {
			let collection;
			switch (image.kind) {
				case 'static':
					collection = idb.gameCompletes.where({
						'settings.image.kind': image.kind,
						'settings.image.key': image.key,
						'settings.tileCount': tileCount
					});
					break;
				case 'custom':
					collection = idb.gameCompletes.where({
						'settings.image.kind': image.kind,
						'settings.image.id': image.id,
						'settings.tileCount': tileCount
					});
					break;
			}
			return (await collection.limit(1).count()) > 0;
		} catch (err) {
			console.error('operation failed', err);
		}
		return false;
	});

	// delete button
	let delConfirm: Confirm;

	const isCustom = image.kind == 'custom';

	async function deleteImage(): Promise<void> {
		if (image.kind == 'custom') {
			if (await delConfirm.ask()) {
				await idb.customImages.delete(image.id);
			}
		}
	}
</script>

<div class="box">
	<a class="card" class:complete={$isComplete === true} href={getUrl(tileCount)}>
		{#await gs.getImage(image) then image}
			<div class="preview">
				<div class="preview-bg" style="background-image: url({image.url});" />
			</div>
			<div class="bar">
				<div class="name">{image.name}</div>
				<div class="tag">
					{#if $isComplete === true}
						<i class="fa-solid fa-circle-check" />
					{/if}
				</div>
			</div>
		{/await}
	</a>
	{#if isCustom}
		<Confirm bind:this={delConfirm}>
			Please confirm image deletion.<br />
			Operation cannot be undone.
		</Confirm>
		<button class="del-btn" on:click={deleteImage}><i class="fa-solid fa-trash" /></button>
	{/if}
</div>

<style>
	.card {
		text-decoration: none;
		padding: none;
		border-radius: 0.5rem;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		transition: 100ms;
		outline: 0.3rem solid transparent;
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
		display: flex;
		justify-content: space-between;
		flex-shrink: 1;
		max-width: 100%;
		gap: 1rem;
	}

	.bar .tag {
		opacity: 0.5;
	}

	.preview {
		width: 100%;
		height: 5rem;
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

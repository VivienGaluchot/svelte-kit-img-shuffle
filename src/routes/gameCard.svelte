<script lang="ts">
	import * as paths from '$app/paths';
	import { db } from '$lib/db';
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
					collection = db.gameCompletes.where({
						'settings.image.kind': image.kind,
						'settings.image.key': image.key,
						'settings.tileCount': tileCount
					});
					break;
				case 'custom':
					collection = db.gameCompletes.where({
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
</script>

<a class="card" class:complete={$isComplete === true} href={getUrl(tileCount)}>
	{#await gs.getImage(image) then image}
		<div class="icon">
			<div class="icon-bg" style="background-image: url({image.url});" />
		</div>
		<div class="img-name">{image.name}</div>
	{/await}
</a>

<style>
	.card {
		text-decoration: none;
		padding: none;
		border-radius: 0.5rem;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: start;
	}

	.card:hover .icon-bg {
		transform: scale(1.1);
	}

	.card:active .icon-bg {
		transform: scale(1.2);
	}

	.icon {
		width: 100%;
		height: 5rem;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.icon-bg {
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

	.complete .icon-bg {
		filter: none;
	}

	.img-name {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		direction: rtl;
	}
</style>

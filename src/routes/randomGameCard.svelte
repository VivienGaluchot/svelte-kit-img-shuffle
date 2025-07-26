<script lang="ts">
	import { goto } from '$app/navigation';
	import * as paths from '$app/paths';
	import * as gs from '$lib/gameSetting';
	import * as rd from '$lib/random';

	interface Props {
		kind: 'static' | 'custom';
		tileCount: number;
	}

	let { kind, tileCount }: Props = $props();

	function onclick() {
		let image: gs.ImageSetting;
		if (kind == 'static') {
			image = { kind: 'static', key: 'x' };
		} else {
			image = { kind: 'custom', id: 0 };
		}
		const url = new URL(`${paths.base}/play`, window.location.origin);
		gs.encodeSettingToUrl(url, { tileCount, seed: rd.getRandomString(Math.random, 6), image });
		goto(url);
	}
</script>

<div class="card">
	<button class="link" {onclick} aria-label="random">?</button>
	<div class="bottom-bar">
		<div class="name">Random</div>
	</div>
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
		width: 100%;
		aspect-ratio: 0.8;
		border: none;
		font-size: 2rem;
	}

	.link:hover {
		border: none;
	}

	.bottom-bar {
		position: absolute;
		background-color: rgba(125, 125, 125, 0.2);
		backdrop-filter: blur(0.2rem);
	}

	.bottom-bar {
		padding: 0.5rem;
		display: flex;
		justify-content: space-between;
		flex-shrink: 1;
		max-width: 100%;
		gap: 1rem;
		transition: 100ms;
		left: 0;
		right: 0;
		bottom: 0;
		visibility: visible;
	}

	.card:hover .bottom-bar {
		bottom: -3rem;
		visibility: hidden;
	}

	.name {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		direction: rtl;
	}
</style>

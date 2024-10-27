import * as im from '$lib/image';
import { db } from '$lib/db';

export type ImageSettings =
	| {
			// play with static image from `im.staticImages`
			kind: 'static';
			// static image key
			key: string;
	  }
	| {
			// play with user provided image
			kind: 'custom';
			// `CustomImage` id in local db
			id: number;
	  };

export type GameSettings = ImageSettings & {
	// number of tile for the game
	tileCount: number;
	// seed
	seed: string;
};

export function encodeSettingToUrl(url: URL, settings: GameSettings): void {
	url.searchParams.set('n', `${settings.tileCount}`);
	url.searchParams.set('s', `${encodeURIComponent(settings.seed)}`);
	if (settings.kind == 'static') {
		url.searchParams.set('i', encodeURIComponent(settings.key));
	}
	if (settings.kind == 'custom') {
		url.searchParams.set('c', encodeURIComponent(settings.id));
	}
}

export function decodeGameSettingsFromUrl(url: URL): GameSettings {
	const n = url.searchParams.get('n');
	if (!n) {
		throw new Error("missing 'n' url parameter");
	}
	const tileCount: number = parseInt(n);

	const s = url.searchParams.get('s');
	if (!s) {
		throw new Error("missing 's' url parameter");
	}
	const seed = decodeURIComponent(s);

	const i = url.searchParams.get('i');
	const c = url.searchParams.get('c');
	if (i) {
		return { kind: 'static', tileCount, seed, key: i };
	} else if (c) {
		const id: number = parseInt(c);
		return { kind: 'custom', tileCount, seed, id };
	} else {
		throw new Error("missing 'c' or 's' url parameter");
	}
}

export async function getImage(settings: ImageSettings): Promise<im.ImageResource> {
	if (settings.kind == 'static') {
		const image = im.staticImages[settings.key];
		if (!image) {
			throw new Error(`unknown image key '${settings.key}'`);
		}
		return image;
	} else {
		const image = await db.customImages.get(settings.id);
		if (!image) {
			throw new Error(`unknown image key '${settings.id}'`);
		}
		return {
			name: image.name,
			url: URL.createObjectURL(image.blob).toString()
		};
	}
}

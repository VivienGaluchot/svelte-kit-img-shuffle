import { PUBLIC_VERSION } from '$env/static/public';
import * as im from '$lib/image';
import * as db from '$lib/db';

export interface StaticImageSetting {
	// play with static image from `im.staticImages`
	kind: 'static';
	// static image key
	key: string;
}

export interface CustomImageSetting {
	// play with user provided image
	kind: 'custom';
	// `CustomImage` id in local db
	id: number;
}

export type ImageSetting = StaticImageSetting | CustomImageSetting;

export interface GameSettings {
	// number of tile for the game
	tileCount: number;
	// seed
	seed: string;
	// image setting
	image: ImageSetting;
}

export function encodeSettingToUrl(url: URL, settings: GameSettings): void {
	url.searchParams.set('n', `${settings.tileCount}`);
	url.searchParams.set('s', `${encodeURIComponent(settings.seed)}`);
	if (settings.image.kind == 'static') {
		url.searchParams.set('i', encodeURIComponent(settings.image.key));
	}
	if (settings.image.kind == 'custom') {
		url.searchParams.set('c', encodeURIComponent(settings.image.id));
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
		return { image: { kind: 'static', key: i }, tileCount, seed };
	} else if (c) {
		const id: number = parseInt(c);
		return { image: { kind: 'custom', id }, tileCount, seed };
	} else {
		throw new Error("missing 'c' or 's' url parameter");
	}
}

export async function getImage(settings: ImageSetting): Promise<im.ImageResource> {
	if (settings.kind == 'static') {
		const image = im.staticImages[settings.key];
		if (!image) {
			throw new Error(`unknown image key '${settings.key}'`);
		}
		return image;
	} else {
		const image = await db.idb.customImages.get(settings.id);
		if (!image) {
			throw new Error(`unknown image key '${settings.id}'`);
		}
		return {
			name: image.name,
			url: URL.createObjectURL(image.blob).toString()
		};
	}
}

export function getTileCount(difficulty: db.Difficulty): number {
	switch (difficulty) {
		case 'easy':
			return PUBLIC_VERSION == 'dev' ? 4 : 40;
		case 'medium':
			return PUBLIC_VERSION == 'dev' ? 6 : 80;
		case 'hard':
			return PUBLIC_VERSION == 'dev' ? 8 : 120;
		case 'super-hard':
			return 240;
	}
}

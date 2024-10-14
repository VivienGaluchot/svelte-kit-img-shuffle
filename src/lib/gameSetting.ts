import * as im from '$lib/image';

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
			// image resource
			image: im.ImageResource;
	  };

export type GameSettings = ImageSettings & {
	// number of tile for the game
	tileCount: number;
};

export function encodeSettingToUrl(url: URL, settings: GameSettings): void {
	url.searchParams.set('n', `${settings.tileCount}`);
	if (settings.kind == 'static') {
		url.searchParams.set('i', encodeURIComponent(settings.key));
	}
	if (settings.kind == 'custom') {
		url.searchParams.set('c', encodeURIComponent(JSON.stringify(settings.image)));
	}
}

export function decodeGameSettingsFromUrl(url: URL): GameSettings {
	const n = url.searchParams.get('n');
	if (!n) {
		throw new Error("missing 'n' url parameter");
	}
	const tileCount: number = parseInt(n);

	const i = url.searchParams.get('i');
	const c = url.searchParams.get('c');
	if (i) {
		return { kind: 'static', tileCount, key: i };
	} else if (c) {
		const image: im.ImageResource = JSON.parse(decodeURIComponent(c));
		return { kind: 'custom', tileCount, image };
	} else {
		throw new Error("missing 'c' or 's' url parameter");
	}
}

export function getImage(settings: ImageSettings): im.ImageResource {
	if (settings.kind == 'static') {
		const image = im.staticImages[settings.key];
		if (!image) {
			throw new Error(`unknown image key '${settings.key}'`);
		}
		return image;
	} else {
		return settings.image;
	}
}

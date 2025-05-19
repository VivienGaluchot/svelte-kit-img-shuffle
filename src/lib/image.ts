import type * as lm from '$lib/math';
import { m } from '$lib/paraglide/messages.js';

import image1 from '$lib/assets/photo-1687057217908-54f8e6d30e3c.avif';
import image2 from '$lib/assets/photo-1689085383650-13d21072f5a6.avif';
import image3 from '$lib/assets/bruno-martins-GkZvxVsHYWw-unsplash.jpg';
import image4 from '$lib/assets/alex-gagareen-r8_ZJ3qzgKo-unsplash.jpg';
import image5 from '$lib/assets/slava-auchynnikau-hAkmZyuHuRE-unsplash.jpg';
import image6 from '$lib/assets/tara-mae-miller-SzI9z8snVjk-unsplash.jpg';
import image7 from '$lib/assets/valeria-kodra-2mj8Yu6Vftc-unsplash.jpg';
import image8 from '$lib/assets/360floralflaves-SNQfkUNHWlA-unsplash.jpg';
import image9 from '$lib/assets/ming-jun-tan--FC5Ozeetuw-unsplash.jpg';
import image10 from '$lib/assets/mikhail-vasilyev-NodtnCsLdTE-unsplash.jpg';

export type ImageResource = {
	// image name
	name: string;
	// image url
	url: string;
};

export interface PuzzleImage extends ImageResource {
	// image size in pixels
	size: lm.Vec2d;
}

export async function toPuzzleImage(res: ImageResource): Promise<PuzzleImage> {
	const meta: HTMLImageElement = await new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = (err) => reject(err);
		img.src = res.url;
	});
	return {
		...res,
		size: { x: meta.naturalWidth, y: meta.naturalHeight }
	};
}

export const staticImages: Record<string, ImageResource> = {
	sea: { name: m.steep_bad_camel_dash(), url: image1 },
	town: { name: m.shy_sleek_anaconda_smile(), url: image2 },
	street: { name: m.odd_tidy_chipmunk_surge(), url: image3 },
	car: { name: m.fresh_trick_crossbill_grasp(), url: image4 },
	air_ballon: { name: m.shy_inclusive_ant_gasp(), url: image5 },
	tag: { name: m.slow_equal_ostrich_win(), url: image6 },
	cosy: { name: m.brave_chunky_stingray_pinch(), url: image7 },
	nut: { name: m.zany_fluffy_stingray_urge(), url: image8 },
	bucks: { name: m.jumpy_actual_midge_buy(), url: image9 },
	image10: { name: m.cute_petty_pig_pop(), url: image10 }
};

export function splitInCell(size: lm.Vec2d, n: number): lm.Vec2d {
	const y = Math.sqrt((n * size.y) / size.x);
	return { x: Math.round(n / y), y: Math.round(y) };
}
